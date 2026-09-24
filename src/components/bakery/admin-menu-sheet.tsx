"use client";

/**
 * AdminMenuSheet — slide-in panel with full CRUD for:
 *   1. Menu categories (add / rename / reorder / delete)
 *   2. Menu items within each category (add / edit price, photo, photo size, etc.)
 *
 * How to open it:
 *   - Click the visible "Admin" link in the footer, OR
 *   - Press Shift+A anywhere on the page.
 *
 * Default admin token is "demo" for dev. Set ADMIN_TOKEN env var in production.
 */
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  useMenu,
  setAdminToken,
  type MenuItemDTO,
  type MenuCategoryDTO,
  type PhotoSize,
} from "./use-menu-items";

const DEFAULT_TOKEN = "demo";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminMenuSheet({ open, onOpenChange }: Props) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [tokenInput, setTokenInput] = React.useState("");
  const {
    items,
    categories,
    isLoadingItems,
    isLoadingCategories,
    isItemsError,
    isCategoriesError,
    patchItem,
    deleteItem,
    createItem,
    patchCategory,
    deleteCategory,
    createCategory,
  } = useMenu();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto bg-background border-border"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-primary">
            Menu admin
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Ajoutez / modifiez / réorganisez les catégories et les plats. Tout est sauvegardé en direct.
          </SheetDescription>
        </SheetHeader>

        {!unlocked ? (
          <UnlockForm
            tokenInput={tokenInput}
            setTokenInput={setTokenInput}
            onSubmit={() => {
              const t = tokenInput.trim() || DEFAULT_TOKEN;
              setAdminToken(t);
              setUnlocked(true);
              toast({
                title: "Token enregistré",
                description: "Si les modifications échouent, le token est erroné.",
              });
            }}
          />
        ) : isItemsError || isCategoriesError ? (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            Impossible de charger le menu. Vérifiez que la base de données est en place
            (lancez <code className="px-1 bg-muted rounded">bun run db:seed</code>).
          </div>
        ) : isLoadingItems || isLoadingCategories ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* === CATEGORIES SECTION === */}
            <CategoriesBlock
              categories={categories}
              onCreate={(cat) =>
                createCategory(cat)
                  .then(() => toast({ title: "Catégorie ajoutée" }))
                  .catch((e) =>
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    })
                  )
              }
              onPatch={(key, patch) =>
                patchCategory({ key, patch })
                  .then(() => toast({ title: "Catégorie mise à jour" }))
                  .catch((e) =>
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    })
                  )
              }
              onDelete={(key) =>
                deleteCategory(key)
                  .then(() =>
                    toast({
                      title: "Catégorie supprimée",
                      description:
                        "Les plats restent en base — re-catégorisez-les ou supprimez-les.",
                    })
                  )
                  .catch((e) =>
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    })
                  )
              }
            />

            <div className="divider-dotted" />

            {/* === ITEMS BY CATEGORY === */}
            {categories.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">
                Aucune catégorie. Créez-en une ci-dessus pour commencer.
              </p>
            ) : (
              categories.map((cat) => (
                <CategoryBlock
                  key={cat.key}
                  category={cat}
                  items={items.filter((i) => i.category === cat.key)}
                  onPatch={(id, patch) =>
                    patchItem({ id, patch })
                      .then(() =>
                        toast({ title: "Mis à jour", description: "Modification enregistrée." })
                      )
                      .catch((e) =>
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        })
                      )
                  }
                  onDelete={(id) =>
                    deleteItem(id)
                      .then(() => toast({ title: "Plat supprimé" }))
                      .catch((e) =>
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        })
                      )
                  }
                  onCreate={(item) =>
                    createItem(item)
                      .then(() => toast({ title: "Plat ajouté" }))
                      .catch((e) =>
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        })
                      )
                  }
                />
              ))
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---------- Unlock form ---------- */
function UnlockForm({
  tokenInput,
  setTokenInput,
  onSubmit,
}: {
  tokenInput: string;
  setTokenInput: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Label htmlFor="token" className="text-xs uppercase tracking-wider text-muted-foreground">
        Jeton admin
      </Label>
      <Input
        id="token"
        type="password"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        placeholder="demo"
        autoFocus
      />
      <p className="text-xs text-muted-foreground">
        Par défaut <code className="px-1 bg-muted rounded">demo</code>. En production, remplacez la variable d'env <code className="px-1 bg-muted rounded">ADMIN_TOKEN</code>.
      </p>
      <Button type="submit" className="w-full bg-primary text-primary-foreground">
        Déverrouiller
      </Button>
    </form>
  );
}

/* ---------- Categories management ---------- */
function CategoriesBlock({
  categories,
  onCreate,
  onPatch,
  onDelete,
}: {
  categories: MenuCategoryDTO[];
  onCreate: (cat: Omit<MenuCategoryDTO, "createdAt" | "updatedAt">) => Promise<void>;
  onPatch: (key: string, patch: Partial<MenuCategoryDTO>) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}) {
  const [showNew, setShowNew] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState<string | null>(null);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const editingCat = categories.find((c) => c.key === editingKey);

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-600 text-primary">
          Catégories <span className="text-xs text-muted-foreground">({categories.length})</span>
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowNew((v) => !v)}
          className="text-xs"
        >
          {showNew ? "Annuler" : "+ Nouvelle catégorie"}
        </Button>
      </div>

      {showNew && (
        <NewCategoryForm
          defaultOrder={categories.length + 1}
          onSubmit={async (cat) => {
            await onCreate(cat);
            setShowNew(false);
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.key}
            className="rounded-md border border-border/60 bg-background p-3"
          >
            {editingKey === cat.key ? (
              <CategoryEditForm
                category={cat}
                onSubmit={async (patch) => {
                  await onPatch(cat.key, patch);
                  setEditingKey(null);
                }}
                onCancel={() => setEditingKey(null)}
              />
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base text-primary">
                    {cat.labelFr} <span className="text-muted-foreground text-sm">/ {cat.labelEn}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    key: <code className="bg-muted px-1 rounded">{cat.key}</code> · ordre: {cat.displayOrder}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingKey(cat.key)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmingDelete(cat.key)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
            {confirmingDelete === cat.key && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="rounded-md border border-border bg-card p-4 max-w-sm w-full">
                  <p className="font-display text-lg text-primary mb-1">
                    Supprimer « {cat.labelFr} » ?
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Les plats de cette catégorie restent en base (non supprimés) — vous devrez les re-catégoriser ou les supprimer séparément.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(null)}>
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await onDelete(cat.key);
                        setConfirmingDelete(null);
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-xs italic text-muted-foreground">
            Aucune catégorie. Créez-en une ci-dessus.
          </li>
        )}
      </ul>
    </section>
  );
}

function NewCategoryForm({
  defaultOrder,
  onSubmit,
  onCancel,
}: {
  defaultOrder: number;
  onSubmit: (cat: Omit<MenuCategoryDTO, "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}) {
  const [key, setKey] = React.useState("");
  const [labelFr, setLabelFr] = React.useState("");
  const [labelEn, setLabelEn] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(String(defaultOrder));
  const [saving, setSaving] = React.useState(false);

  return (
    <form
      className="mb-3 rounded-md border border-accent/40 bg-accent/5 p-3 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSubmit({
            key: key.toLowerCase().trim(),
            labelFr,
            labelEn,
            displayOrder: Number(displayOrder),
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <div>
        <Label className="text-xs">Clé (slug, ex: smoothies)</Label>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="smoothies"
          required
          pattern="[a-z0-9-]+"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Nom (FR)</Label>
          <Input value={labelFr} onChange={(e) => setLabelFr(e.target.value)} placeholder="Smoothies" required />
        </div>
        <div>
          <Label className="text-xs">Name (EN)</Label>
          <Input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} placeholder="Smoothies" required />
        </div>
      </div>
      <div>
        <Label className="text-xs">Ordre d'affichage</Label>
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          min={0}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Ajout..." : "Ajouter la catégorie"}
        </Button>
      </div>
    </form>
  );
}

function CategoryEditForm({
  category,
  onSubmit,
  onCancel,
}: {
  category: MenuCategoryDTO;
  onSubmit: (patch: Partial<MenuCategoryDTO>) => Promise<void>;
  onCancel: () => void;
}) {
  const [labelFr, setLabelFr] = React.useState(category.labelFr);
  const [labelEn, setLabelEn] = React.useState(category.labelEn);
  const [displayOrder, setDisplayOrder] = React.useState(String(category.displayOrder));
  const [saving, setSaving] = React.useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSubmit({
            labelFr,
            labelEn,
            displayOrder: Number(displayOrder),
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Nom (FR)</Label>
          <Input value={labelFr} onChange={(e) => setLabelFr(e.target.value)} required />
        </div>
        <div>
          <Label className="text-xs">Name (EN)</Label>
          <Input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label className="text-xs">Ordre d'affichage</Label>
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          min={0}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
}

/* ---------- Per-category block (items) ---------- */
function CategoryBlock({
  category,
  items,
  onPatch,
  onDelete,
  onCreate,
}: {
  category: MenuCategoryDTO;
  items: MenuItemDTO[];
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (item: Omit<MenuItemDTO, "id">) => Promise<void>;
}) {
  const [showNew, setShowNew] = React.useState(false);

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-600 text-primary">
          {category.labelFr} <span className="text-muted-foreground text-sm">/ {category.labelEn}</span>
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowNew((v) => !v)}
          className="text-xs"
        >
          {showNew ? "Annuler" : "+ Nouveau plat"}
        </Button>
      </div>

      {showNew && (
        <ItemForm
          defaultCategory={category.key}
          defaultOrder={items.length + 1}
          onSubmit={async (item) => {
            await onCreate(item);
            setShowNew(false);
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="rounded-md border border-border/60 bg-background p-3">
            <ItemRow item={it} onPatch={onPatch} onDelete={onDelete} />
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-xs italic text-muted-foreground">
            Aucun plat dans cette catégorie.
          </li>
        )}
      </ul>
    </section>
  );
}

/* ---------- Per-item row (compact) ---------- */
function ItemRow({
  item,
  onPatch,
  onDelete,
}: {
  item: MenuItemDTO;
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  if (!expanded) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-display text-base text-primary truncate">
            {item.nameFr} <span className="text-accent ml-1">{item.price} MAD</span>
          </div>
          <div className="text-xs text-muted-foreground truncate">{item.descFr}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            photo: <span className="text-accent">{item.photoSize}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(true)}>
            Modifier
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmingDelete(true)}
          >
            Supprimer
          </Button>
        </div>
        {confirmingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="rounded-md border border-border bg-card p-4 max-w-sm w-full">
              <p className="font-display text-lg text-primary mb-3">
                Supprimer « {item.nameFr} » ?
              </p>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  Annuler
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await onDelete(item.id);
                    setConfirmingDelete(false);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ItemForm
      key={item.id}
      item={item}
      onSubmit={async (patch) => {
        await onPatch(item.id, patch);
        setExpanded(false);
      }}
      onCancel={() => setExpanded(false)}
    />
  );
}

/* ---------- Full form (used for create + edit) ---------- */
function ItemForm({
  item,
  defaultCategory,
  defaultOrder,
  onSubmit,
  onCancel,
}: {
  item?: MenuItemDTO;
  defaultCategory?: string;
  defaultOrder?: number;
  onSubmit: (item: Partial<MenuItemDTO>) => Promise<void>;
  onCancel: () => void;
}) {
  const [nameFr, setNameFr] = React.useState(item?.nameFr ?? "");
  const [nameEn, setNameEn] = React.useState(item?.nameEn ?? "");
  const [descFr, setDescFr] = React.useState(item?.descFr ?? "");
  const [descEn, setDescEn] = React.useState(item?.descEn ?? "");
  const [price, setPrice] = React.useState(String(item?.price ?? 50));
  const [photoUrl, setPhotoUrl] = React.useState(item?.photoUrl ?? "");
  const [photoSize, setPhotoSize] = React.useState<PhotoSize>(
    (item?.photoSize as PhotoSize) ?? "small"
  );
  const [category, setCategory] = React.useState<string>(
    item?.category ?? defaultCategory ?? "pancakes"
  );
  const [order, setOrder] = React.useState(String(item?.order ?? defaultOrder ?? 1));
  const [saving, setSaving] = React.useState(false);

  // Pull categories from the hook so the dropdown is always current
  const { categories } = useMenu();

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSubmit({
            nameFr,
            nameEn,
            descFr,
            descEn,
            price: Number(price),
            photoUrl: photoUrl || null,
            photoSize,
            category,
            order: Number(order),
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Nom (FR)</Label>
          <Input value={nameFr} onChange={(e) => setNameFr(e.target.value)} required />
        </div>
        <div>
          <Label className="text-xs">Name (EN)</Label>
          <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Description (FR)</Label>
          <Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={2} required />
        </div>
        <div>
          <Label className="text-xs">Description (EN)</Label>
          <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Prix (MAD)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
          />
        </div>
        <div>
          <Label className="text-xs">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.labelFr} / {c.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Ordre</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min={0}
          />
        </div>
        <div>
          <Label className="text-xs">Taille photo</Label>
          <Select value={photoSize} onValueChange={(v) => setPhotoSize(v as PhotoSize)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite (menu + galerie)</SelectItem>
              <SelectItem value="medium">Moyenne (menu + galerie)</SelectItem>
              <SelectItem value="large">Grande (menu + galerie)</SelectItem>
              <SelectItem value="feature">Vedette (galerie 2×2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">URL photo</Label>
        <Input
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://z-cdn.chatglm.cn/..."
        />
        {photoUrl && (
          <div className="mt-2 rounded-md overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="preview" className="h-32 w-full object-cover" />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
}

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
 * Set ADMIN_TOKEN in the server environment to enable admin access.
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
import { useSettings } from "./use-settings";

/**
 * StoryBlock — lets the owner rewrite the "Our Story" section (title +
 * two paragraphs, in French and English) and swap its photo, without
 * touching any code. Leaving a field blank keeps the original default
 * copy on the live site.
 */
function StoryBlock() {
  const { settings, isLoading, patchSettings, isSaving } = useSettings();
  const [titleFr, setTitleFr] = React.useState("");
  const [titleEn, setTitleEn] = React.useState("");
  const [bodyFr1, setBodyFr1] = React.useState("");
  const [bodyEn1, setBodyEn1] = React.useState("");
  const [bodyFr2, setBodyFr2] = React.useState("");
  const [bodyEn2, setBodyEn2] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (settings && !loaded) {
      setTitleFr(settings.storyTitleFr ?? "");
      setTitleEn(settings.storyTitleEn ?? "");
      setBodyFr1(settings.storyBodyFr1 ?? "");
      setBodyEn1(settings.storyBodyEn1 ?? "");
      setBodyFr2(settings.storyBodyFr2 ?? "");
      setBodyEn2(settings.storyBodyEn2 ?? "");
      setPhotoUrl(settings.storyPhotoUrl ?? "");
      setLoaded(true);
    }
  }, [settings, loaded]);

  if (isLoading) {
    return <div className="h-40 rounded-md bg-muted animate-pulse" />;
  }

  return (
    <section>
      <h3 className="font-display text-xl font-600 text-primary mb-1">
        À propos (section "Notre histoire")
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Laissez un champ vide pour garder le texte par défaut du site.
      </p>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await patchSettings({
              storyTitleFr: titleFr || null,
              storyTitleEn: titleEn || null,
              storyBodyFr1: bodyFr1 || null,
              storyBodyEn1: bodyEn1 || null,
              storyBodyFr2: bodyFr2 || null,
              storyBodyEn2: bodyEn2 || null,
              storyPhotoUrl: photoUrl || null,
            });
            toast({ title: "À propos mis à jour" });
          } catch (err) {
            toast({
              title: "Échec",
              description: String((err as Error).message || err),
              variant: "destructive",
            });
function GalleryManager({
  items,
  onPatch,
}: {
  items: MenuItemDTO[];
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? "");
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const visibleCount = items.filter(
    (item) => item.photoUrl && item.showInGallery
  ).length;

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <div className="mb-3">
        <h3 className="font-display text-lg font-600 text-primary">
          Galerie photo
        </h3>
        <p className="text-xs text-muted-foreground">
          {visibleCount} photo(s) sélectionnée(s), 6 maximum affichées.
        </p>
      </div>
      {selectedItem ? (
        <>
          <Label htmlFor="gallery-item" className="text-xs">Plat</Label>
          <Select value={selectedItem.id} onValueChange={setSelectedId}>
            <SelectTrigger id="gallery-item" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nameFr} / {item.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <GalleryItemEditor
            key={selectedItem.id}
            item={selectedItem}
            onPatch={onPatch}
          />
        </>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          Ajoutez un plat avant de gérer les photos de la galerie.
        </p>
      )}
    </section>
  );
}

function GalleryItemEditor({
  item,
  onPatch,
}: {
  item: MenuItemDTO;
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
}) {
  const [photoUrl, setPhotoUrl] = React.useState(item.photoUrl ?? "");
  const [saving, setSaving] = React.useState(false);

  const savePhoto = async () => {
    setSaving(true);
    try {
      await onPatch(item.id, { photoUrl: photoUrl || null });
      toast({ title: "Photo de galerie mise à jour" });
    } catch (error) {
      toast({
        title: "Échec",
        description: String((error as Error).message || error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={item.showInGallery}
          onChange={async (event) => {
            try {
              await onPatch(item.id, { showInGallery: event.currentTarget.checked });
            } catch (error) {
              toast({
                title: "Échec",
                description: String((error as Error).message || error),
                variant: "destructive",
              });
            }
          }}
          className="h-4 w-4 accent-accent"
        />
        Afficher ce plat dans la galerie
      </label>
      <div>
        <Label className="text-xs">Photo du plat</Label>
        <p className="mb-2 text-xs text-muted-foreground">
          Cette photo est aussi utilisée sur la carte du menu. La case ci-dessus
          permet de la masquer uniquement dans la galerie.
        </p>
        <PhotoField photoUrl={photoUrl} onChange={setPhotoUrl} />
      </div>
      <Button
        type="button"
        size="sm"
        disabled={saving || photoUrl === (item.photoUrl ?? "")}
        onClick={savePhoto}
      >
        {saving ? "Sauvegarde..." : "Enregistrer la photo"}
      </Button>
    </div>
  );
}
          }
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Titre (FR)</Label>
            <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Title (EN)</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Paragraphe 1 (FR)</Label>
            <Textarea value={bodyFr1} onChange={(e) => setBodyFr1(e.target.value)} rows={3} />
          </div>
          <div>
            <Label className="text-xs">Paragraph 1 (EN)</Label>
            <Textarea value={bodyEn1} onChange={(e) => setBodyEn1(e.target.value)} rows={3} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Paragraphe 2 (FR)</Label>
            <Textarea value={bodyFr2} onChange={(e) => setBodyFr2(e.target.value)} rows={3} />
          </div>
          <div>
            <Label className="text-xs">Paragraph 2 (EN)</Label>
            <Textarea value={bodyEn2} onChange={(e) => setBodyEn2(e.target.value)} rows={3} />
          </div>
        </div>
        <div>
          <Label className="text-xs">Photo</Label>
          <PhotoField photoUrl={photoUrl} onChange={setPhotoUrl} />
        </div>
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </form>
    </section>
  );
}



/**
 * PhotoField — lets the café owner pick a photo straight from their phone
 * or computer (camera roll or file browser). The image is resized to a
 * max of 1000px on its longest side and compressed to JPEG client-side,
 * then stored as a data URL directly in the database — no separate file
 * host needed. A "paste a URL instead" fallback stays available for
 * anyone who already has photos hosted elsewhere.
 */
function PhotoField({
  photoUrl,
  onChange,
}: {
  photoUrl: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setFileError("Choisissez un fichier image.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setFileError("L'image doit faire moins de 12 Mo.");
      return;
    }

    setFileError(null);
    setBusy(true);
    const fail = () => {
      setFileError("Impossible de traiter cette image. Essayez un autre fichier.");
      setBusy(false);
    };
    const reader = new FileReader();
    reader.onerror = fail;
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        fail();
        return;
      }
      const img = new window.Image();
      img.onerror = fail;
      img.onload = () => {
        const MAX = 1000;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        if (!width || !height) {
          fail();
          return;
        }
        if (width > height && width > MAX) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else if (height > MAX) {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          fail();
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        onChange(canvas.toDataURL("image/jpeg", 0.82));
        setBusy(false);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {photoUrl && (
        <div className="relative overflow-hidden rounded-md border border-border">
          <img src={photoUrl} alt="Aperçu" className="h-32 w-full object-cover" />
        </div>
      )}
      {fileError && (
        <p role="alert" className="text-sm text-destructive">
          {fileError}
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.currentTarget.value = "";
        }}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "Traitement..." : photoUrl ? "Changer la photo" : "Choisir une photo"}
        </Button>
        {photoUrl && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange("")}
          >
            Retirer
          </Button>
        )}
      </div>
      <button
        type="button"
        className="text-xs text-muted-foreground underline underline-offset-2"
        onClick={() => setShowUrlInput((v) => !v)}
      >
        {showUrlInput ? "Masquer le champ URL" : "Ou coller une URL de photo existante"}
      </button>
      {showUrlInput && (
        <Input
          value={photoUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      )}
    </div>
  );
}

function GalleryManager({
  items,
  onPatch,
}: {
  items: MenuItemDTO[];
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? "");
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const visibleCount = items.filter(
    (item) => item.photoUrl && item.showInGallery
  ).length;

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-600 text-primary">Galerie photo</h3>
          <p className="text-xs text-muted-foreground">
            {visibleCount} photo(s) sélectionnée(s), 6 maximum affichées.
          </p>
        </div>
      </div>
      {selectedItem ? (
        <>
          <Label htmlFor="gallery-item" className="text-xs">Plat</Label>
          <Select value={selectedItem.id} onValueChange={setSelectedId}>
            <SelectTrigger id="gallery-item" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nameFr} / {item.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <GalleryItemEditor
            key={selectedItem.id}
            item={selectedItem}
            onPatch={onPatch}
          />
        </>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          Ajoutez un plat avant de gérer les photos de la galerie.
        </p>
      )}
    </section>
  );
}

function GalleryItemEditor({
  item,
  onPatch,
}: {
  item: MenuItemDTO;
  onPatch: (id: string, patch: Partial<MenuItemDTO>) => Promise<void>;
}) {
  const [photoUrl, setPhotoUrl] = React.useState(item.photoUrl ?? "");
  const [saving, setSaving] = React.useState(false);

  const savePhoto = async () => {
    setSaving(true);
    try {
      await onPatch(item.id, { photoUrl: photoUrl || null });
      toast({ title: "Photo de galerie mise à jour" });
    } catch (error) {
      toast({
        title: "Échec",
        description: String((error as Error).message || error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={item.showInGallery}
          onChange={async (event) => {
            try {
              await onPatch(item.id, { showInGallery: event.currentTarget.checked });
            } catch (error) {
              toast({
                title: "Échec",
                description: String((error as Error).message || error),
                variant: "destructive",
              });
            }
          }}
          className="h-4 w-4 accent-accent"
        />
        Afficher ce plat dans la galerie
      </label>
      <div>
        <Label className="text-xs">Photo du plat</Label>
        <PhotoField photoUrl={photoUrl} onChange={setPhotoUrl} />
      </div>
      <Button
        type="button"
        size="sm"
        disabled={saving || photoUrl === (item.photoUrl ?? "")}
        onClick={savePhoto}
      >
        {saving ? "Sauvegarde..." : "Enregistrer la photo"}
      </Button>
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminMenuSheet({ open, onOpenChange }: Props) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [tokenInput, setTokenInput] = React.useState("");
  const [checking, setChecking] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
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
            checking={checking}
            authError={authError}
            onSubmit={async () => {
              setChecking(true);
              setAuthError(null);
              try {
                const r = await fetch("/api/verify", {
                  headers: { Authorization: `Bearer ${tokenInput}` },
                });
                if (r.ok) {
                  setAdminToken(tokenInput);
                  setUnlocked(true);
                  toast({ title: "Accès autorisé" });
                } else if (r.status === 503) {
                  setAuthError("ADMIN_TOKEN n'est pas configuré sur le serveur.");
                } else {
                  setAuthError("Mot de passe incorrect. Réessayez.");
                }
              } catch {
                setAuthError("Impossible de vérifier — vérifiez votre connexion.");
              } finally {
                setChecking(false);
              }
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
            {/* === ABOUT / STORY SECTION (owner-editable text + photo) === */}
            <StoryBlock />

            <div className="divider-dotted" />

            <GalleryManager
              items={items}
              onPatch={async (id, patch) => {
                await patchItem({ id, patch });
              }}
            />

            <div className="divider-dotted" />

            {/* === CATEGORIES SECTION === */}
            <CategoriesBlock
              categories={categories}
              onCreate={(cat) =>
                createCategory(cat)
                  .then(() => {
                    toast({ title: "Catégorie ajoutée" });
                  })
                  .catch((e) => {
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    });
                  })
              }
              onPatch={(key, patch) =>
                patchCategory({ key, patch })
                  .then(() => {
                    toast({ title: "Catégorie mise à jour" });
                  })
                  .catch((e) => {
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    });
                  })
              }
              onDelete={(key) =>
                deleteCategory(key)
                  .then(() => {
                    toast({
                      title: "Catégorie supprimée",
                      description:
                        "Les plats restent en base — re-catégorisez-les ou supprimez-les.",
                    });
                  })
                  .catch((e) => {
                    toast({
                      title: "Échec",
                      description: String(e.message || e),
                      variant: "destructive",
                    });
                  })
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
                      .then(() => {
                        toast({ title: "Mis à jour", description: "Modification enregistrée." });
                      })
                      .catch((e) => {
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        });
                      })
                  }
                  onDelete={(id) =>
                    deleteItem(id)
                      .then(() => {
                        toast({ title: "Plat supprimé" });
                      })
                      .catch((e) => {
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        });
                      })
                  }
                  onCreate={(item) =>
                    createItem(item as Omit<MenuItemDTO, "id">)
                      .then(() => {
                        toast({ title: "Plat ajouté" });
                      })
                      .catch((e) => {
                        toast({
                          title: "Échec",
                          description: String(e.message || e),
                          variant: "destructive",
                        });
                      })
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
  checking,
  authError,
}: {
  tokenInput: string;
  setTokenInput: (v: string) => void;
  onSubmit: () => void;
  checking: boolean;
  authError: string | null;
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
        Mot de passe admin
      </Label>
      <Input
        id="token"
        type="password"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        autoFocus
      />
      {authError && (
        <p className="text-xs font-500 text-destructive">{authError}</p>
      )}
      <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={checking}>
        {checking ? "Vérification..." : "Déverrouiller"}
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
            await onCreate(item as Omit<MenuItemDTO, "id">);
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
        <Label className="text-xs">Photo</Label>
        <PhotoField photoUrl={photoUrl} onChange={setPhotoUrl} />
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
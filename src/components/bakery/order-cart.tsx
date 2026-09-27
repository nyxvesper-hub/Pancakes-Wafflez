"use client";

import * as React from "react";
import { Check, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MenuItemDTO } from "./use-menu-items";
import type { Lang, Translation } from "./strings";
import { WhatsAppIcon } from "./icons";

type CartExtra = Pick<MenuItemDTO, "id" | "nameFr" | "nameEn" | "price">;

export type CartLine = {
  key: string;
  itemId: string;
  nameFr: string;
  nameEn: string;
  extras: CartExtra[];
  quantity: number;
  unitPrice: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  total: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: MenuItemDTO, extras: CartExtra[], quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "pancakes-wafflez-cart-v2";
const CartContext = React.createContext<CartContextValue | null>(null);

function getLineKey(itemId: string, extras: CartExtra[]) {
  return `${itemId}:${extras.map((extra) => extra.id).sort().join(",")}`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored) as CartLine[]);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    }
  }, [hydrated, lines]);

  const addItem = (item: MenuItemDTO, extras: CartExtra[], quantity: number) => {
    const normalizedExtras = [...extras].sort((first, second) =>
      first.id.localeCompare(second.id)
    );
    const key = getLineKey(item.id, normalizedExtras);
    const unitPrice = item.price + normalizedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );

    setLines((currentLines) => {
      const existingLine = currentLines.find((line) => line.key === key);
      if (existingLine) {
        return currentLines.map((line) =>
          line.key === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }

      return [
        ...currentLines,
        {
          key,
          itemId: item.id,
          nameFr: item.nameFr,
          nameEn: item.nameEn,
          extras: normalizedExtras,
          quantity,
          unitPrice,
        },
      ];
    });
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((currentLines) => currentLines.filter((line) => line.key !== key));
      return;
    }
    setLines((currentLines) =>
      currentLines.map((line) =>
        line.key === key ? { ...line, quantity } : line
      )
    );
  };

  const removeItem = (key: string) => {
    setLines((currentLines) => currentLines.filter((line) => line.key !== key));
  };

  const clearCart = () => setLines([]);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        itemCount,
        total,
        cartOpen,
        setCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside OrderProvider");
  }
  return context;
}

function AddButton({
  item,
  lang,
  t,
  onAdd,
  added,
}: {
  item: MenuItemDTO;
  lang: Lang;
  t: Translation;
  onAdd: () => void;
  added: boolean;
}) {
  const name = lang === "en" ? item.nameEn : item.nameFr;
  return (
    <Button
      type="button"
      size="sm"
      variant={added ? "secondary" : "outline"}
      className="mt-auto min-h-9 w-fit rounded-full border-accent px-3 text-accent hover:bg-accent hover:text-accent-foreground"
      onClick={onAdd}
      aria-label={`${added ? t.ordering.added : t.ordering.add}: ${name}`}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {added ? t.ordering.added : t.ordering.add}
    </Button>
  );
}

export function ProductCustomizer({
  item,
  extras = [],
  lang,
  t,
}: {
  item: MenuItemDTO;
  extras?: MenuItemDTO[];
  lang: Lang;
  t: Translation;
}) {
  const [open, setOpen] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [selectedExtraIds, setSelectedExtraIds] = React.useState<string[]>([]);
  const [quantity, setQuantity] = React.useState(1);
  const feedbackTimer = React.useRef<number | null>(null);
  const { addItem } = useCart();
  const name = lang === "en" ? item.nameEn : item.nameFr;

  React.useEffect(() => {
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

  const showAddedFeedback = () => {
    setAdded(true);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAdded(false), 1400);
  };

  const addDirectly = () => {
    addItem(item, [], 1);
    showAddedFeedback();
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedExtraIds([]);
      setQuantity(1);
    }
  }, [open]);

  const selectedExtras = extras.filter((extra) =>
    selectedExtraIds.includes(extra.id)
  );
  const unitPrice = item.price + selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );

  const toggleExtra = (extraId: string) => {
    setSelectedExtraIds((currentIds) =>
      currentIds.includes(extraId)
        ? currentIds.filter((id) => id !== extraId)
        : [...currentIds, extraId]
    );
  };

  if (extras.length === 0) {
    return (
      <AddButton
        item={item}
        lang={lang}
        t={t}
        onAdd={addDirectly}
        added={added}
      />
    );
  }

  return (
    <>
      <AddButton
        item={item}
        lang={lang}
        t={t}
        onAdd={() => setOpen(true)}
        added={false}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[min(90vh,40rem)] overflow-y-auto sm:max-w-lg"
        >
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <DialogTitle className="font-display text-2xl text-primary">
                  {name}
                </DialogTitle>
                <DialogDescription>
                  {t.ordering.basePrice}: {item.price} MAD
                </DialogDescription>
              </div>
              <DialogClose
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"
                aria-label={t.ordering.closeCustomization}
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogHeader>

          <fieldset className="space-y-3">
            <legend className="font-display text-lg font-600 text-primary">
              {t.ordering.extras}
            </legend>
            <div className="space-y-2">
              {extras.map((extra) => {
                const extraName = lang === "en" ? extra.nameEn : extra.nameFr;
                const checked = selectedExtraIds.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-primary">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExtra(extra.id)}
                        className="h-4 w-4 accent-accent"
                      />
                      {extraName}
                    </span>
                    <span className="num-vintage text-sm text-accent">
                      +{extra.price} MAD
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
            <span className="text-sm font-500 text-primary">{t.ordering.quantity}</span>
            <QuantityControls
              quantity={quantity}
              onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
              onIncrease={() => setQuantity((value) => value + 1)}
              decreaseLabel={t.ordering.decrease}
              increaseLabel={t.ordering.increase}
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 font-600 text-primary">
            <span>{t.ordering.total}</span>
            <span className="num-vintage text-xl text-accent">
              {unitPrice * quantity} MAD
            </span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                addItem(item, selectedExtras, quantity);
                setOpen(false);
                showAddedFeedback();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {t.ordering.addToCart}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuantityControls({
  quantity,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onDecrease}
        aria-label={decreaseLabel}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-6 text-center text-sm font-600" aria-live="polite">
        {quantity}
      </span>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onIncrease}
        aria-label={increaseLabel}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CartDock({
  lang,
  t,
  buildCheckoutHref,
}: {
  lang: Lang;
  t: Translation;
  buildCheckoutHref: (lines: CartLine[], note: string, name: string) => string;
}) {
  const {
    lines,
    itemCount,
    total,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [note, setNote] = React.useState("");
  const [name, setName] = React.useState("");

  const scrollToMenu = () => {
    setCartOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-30 md:bottom-5 md:left-auto md:right-5 md:w-auto">
        <button
          type="button"
          className="hidden min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-500 text-primary shadow-lg transition-colors hover:border-primary hover:bg-secondary md:inline-flex"
          onClick={() => setCartOpen(true)}
          aria-label={t.ordering.openCart}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{t.ordering.cartLabel}</span>
          <span className="text-muted-foreground">
            · {itemCount} {itemCount === 1 ? t.ordering.itemLabel : t.ordering.itemsLabel} · {total} MAD
          </span>
        </button>

        {lines.length > 0 && (
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-primary bg-primary px-4 py-3 text-left text-sm text-primary-foreground shadow-xl md:hidden"
            onClick={() => setCartOpen(true)}
            aria-label={t.ordering.openCart}
          >
            <span className="flex min-w-0 items-center gap-2">
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {itemCount} {itemCount === 1 ? t.ordering.itemLabel : t.ordering.itemsLabel} · {total} MAD
              </span>
            </span>
            <span className="shrink-0 font-600">{t.ordering.viewCart}</span>
          </button>
        )}
      </div>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[min(90vh,42rem)] overflow-y-auto sm:max-w-lg"
        >
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <DialogTitle className="font-display text-2xl text-primary">
                  {lines.length > 0 ? t.ordering.cartTitle : t.ordering.emptyTitle}
                </DialogTitle>
                <DialogDescription>
                  {lines.length > 0 ? t.ordering.cartDescription : t.ordering.emptyDescription}
                </DialogDescription>
              </div>
              <DialogClose
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"
                aria-label={t.ordering.closeCart}
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogHeader>

          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <ShoppingCart className="h-10 w-10 text-accent" />
              <p className="max-w-xs text-sm text-muted-foreground">
                {t.ordering.emptyBody}
              </p>
              <Button
                type="button"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={scrollToMenu}
              >
                {t.ordering.viewMenu}
              </Button>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {lines.map((line) => {
                  const lineName = lang === "en" ? line.nameEn : line.nameFr;
                  return (
                    <li
                      key={line.key}
                      className="border-b border-border/70 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-base text-primary">
                            {lineName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            × {line.quantity}
                          </p>
                          {line.extras.length > 0 && (
                            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                              {line.extras.map((extra) => (
                                <li key={extra.id}>
                                  + {lang === "en" ? extra.nameEn : extra.nameFr}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="num-vintage shrink-0 text-sm text-accent">
                          {line.unitPrice * line.quantity} MAD
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QuantityControls
                          quantity={line.quantity}
                          onDecrease={() => updateQuantity(line.key, line.quantity - 1)}
                          onIncrease={() => updateQuantity(line.key, line.quantity + 1)}
                          decreaseLabel={t.ordering.decrease}
                          increaseLabel={t.ordering.increase}
                        />
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs text-muted-foreground hover:bg-muted hover:text-destructive"
                          onClick={() => removeItem(line.key)}
                          aria-label={`${t.ordering.remove}: ${lineName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t.ordering.remove}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm text-primary">
                  <span>{t.ordering.subtotal}</span>
                  <span className="num-vintage text-accent">{total} MAD</span>
                </div>
                <div className="flex items-center justify-between font-600 text-primary">
                  <span>{t.ordering.total}</span>
                  <span className="num-vintage text-xl text-accent">{total} MAD</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <label className="block text-sm font-500 text-primary" htmlFor="order-name">
                  {t.ordering.nameLabel}
                </label>
                <Input
                  id="order-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.ordering.namePlaceholder}
                />
                <label className="block text-sm font-500 text-primary" htmlFor="order-note">
                  {t.ordering.noteLabel}
                </label>
                <Textarea
                  id="order-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={t.ordering.notePlaceholder}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={scrollToMenu}
                >
                  {t.ordering.continueShopping}
                </Button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-600 text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    window.open(buildCheckoutHref(lines, note, name), "_blank", "noopener,noreferrer");
                  }}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t.ordering.checkoutWhatsApp}
                </button>
              </div>
              <DialogFooter className="sr-only" />
            </>
          )}

          {lines.length > 0 && (
            <button
              type="button"
              className="inline-flex min-h-9 w-fit items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearCart}
              aria-label={t.ordering.clearCart}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t.ordering.clearCart}
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

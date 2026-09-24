"use client";

/**
 * useMenu — TanStack Query hook that fetches both menu items AND categories.
 * Exposes mutation helpers for the admin Sheet (items: create/update/delete,
 * categories: create/update/delete).
 *
 * The admin Sheet uses these mutations. The public Menu section reads
 * `items` + `categories` and falls back to empty arrays when the network
 * call hasn't returned yet.
 *
 * Categories are DB-driven now (not hardcoded) — the owner can add a new
 * food section ("Smoothies", "Salades", etc.) from the admin Sheet and it
 * appears on the live page instantly.
 *
 * Each menu item has a `photoSize` field ("small" | "medium" | "large" |
 * "feature") that controls how its thumbnail renders in the menu + gallery.
 */
import * as React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type PhotoSize = "small" | "medium" | "large" | "feature";

export type MenuItemDTO = {
  id: string;
  category: string;
  order: number;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  photoUrl: string | null;
  photoSize: PhotoSize;
};

export type MenuCategoryDTO = {
  key: string;
  labelFr: string;
  labelEn: string;
  displayOrder: number;
};

const ADMIN_TOKEN =
  (typeof window !== "undefined" && localStorage.getItem("admin_token")) ||
  "demo";

async function fetchMenu(): Promise<MenuItemDTO[]> {
  const r = await fetch("/api/menu", { cache: "no-store" });
  if (!r.ok) throw new Error(`Menu fetch failed: ${r.status}`);
  return r.json();
}

async function fetchCategories(): Promise<MenuCategoryDTO[]> {
  const r = await fetch("/api/menu/categories", { cache: "no-store" });
  if (!r.ok) throw new Error(`Categories fetch failed: ${r.status}`);
  return r.json();
}

async function patchItem({
  id,
  patch,
}: {
  id: string;
  patch: Partial<MenuItemDTO>;
}): Promise<MenuItemDTO> {
  const r = await fetch(`/api/menu/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`Patch failed: ${r.status}`);
  return r.json();
}

async function deleteItem(id: string): Promise<void> {
  const r = await fetch(`/api/menu/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!r.ok) throw new Error(`Delete failed: ${r.status}`);
}

async function createItem(item: Omit<MenuItemDTO, "id">): Promise<MenuItemDTO> {
  const r = await fetch("/api/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(item),
  });
  if (!r.ok) throw new Error(`Create failed: ${r.status}`);
  return r.json();
}

async function patchCategory({
  key,
  patch,
}: {
  key: string;
  patch: Partial<MenuCategoryDTO>;
}): Promise<MenuCategoryDTO> {
  const r = await fetch(`/api/menu/categories/${key}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`Category patch failed: ${r.status}`);
  return r.json();
}

async function deleteCategory(key: string): Promise<void> {
  const r = await fetch(`/api/menu/categories/${key}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!r.ok) throw new Error(`Category delete failed: ${r.status}`);
}

async function createCategory(
  cat: Omit<MenuCategoryDTO, "createdAt" | "updatedAt">
): Promise<MenuCategoryDTO> {
  const r = await fetch("/api/menu/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(cat),
  });
  if (!r.ok) throw new Error(`Category create failed: ${r.status}`);
  return r.json();
}

export function useMenu() {
  const qc = useQueryClient();
  const itemsKey = ["menu-items"];
  const catsKey = ["menu-categories"];

  const itemsQuery = useQuery<MenuItemDTO[]>({
    queryKey: itemsKey,
    queryFn: fetchMenu,
    staleTime: 30_000,
  });
  const catsQuery = useQuery<MenuCategoryDTO[]>({
    queryKey: catsKey,
    queryFn: fetchCategories,
    staleTime: 30_000,
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: itemsKey });
    qc.invalidateQueries({ queryKey: catsKey });
  };

  const patchMut = useMutation({
    mutationFn: patchItem,
    onSuccess: invalidateAll,
  });
  const deleteMut = useMutation({
    mutationFn: deleteItem,
    onSuccess: invalidateAll,
  });
  const createMut = useMutation({
    mutationFn: createItem,
    onSuccess: invalidateAll,
  });
  const patchCatMut = useMutation({
    mutationFn: patchCategory,
    onSuccess: invalidateAll,
  });
  const deleteCatMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidateAll,
  });
  const createCatMut = useMutation({
    mutationFn: createCategory,
    onSuccess: invalidateAll,
  });

  return {
    // items
    items: itemsQuery.data ?? [],
    isLoadingItems: itemsQuery.isLoading,
    isItemsError: itemsQuery.isError,
    refetchItems: itemsQuery.refetch,

    // categories
    categories: catsQuery.data ?? [],
    isLoadingCategories: catsQuery.isLoading,
    isCategoriesError: catsQuery.isError,
    refetchCategories: catsQuery.refetch,

    // item mutations
    patchItem: patchMut.mutateAsync,
    deleteItem: deleteMut.mutateAsync,
    createItem: createMut.mutateAsync,

    // category mutations
    patchCategory: patchCatMut.mutateAsync,
    deleteCategory: deleteCatMut.mutateAsync,
    createCategory: createCatMut.mutateAsync,

    // meta
    isPatching: patchMut.isPending,
    isDeleting: deleteMut.isPending,
    isCreating: createMut.isPending,
    isPatchCat: patchCatMut.isPending,
    isDeleteCat: deleteCatMut.isPending,
    isCreateCat: createCatMut.isPending,
  };
}

/**
 * Set the admin token in localStorage. The default "demo" token works
 * against the dev server (where ADMIN_TOKEN env falls back to "demo").
 * In production, set ADMIN_TOKEN on the server and have the admin type
 * it in the Sheet once to unlock editing.
 */
export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", token);
  }
}

/**
 * @deprecated — use useMenu() instead. Kept for backward compat with old
 * admin sheet code; will be removed next iteration.
 */
export const MENU_CATEGORIES = ["pancakes", "waffles", "brunch", "bakery"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];
export const useMenuItems = useMenu;

"use client";

/**
 * useMenu — TanStack Query hook that fetches both menu items AND categories.
 * The public Menu section reads `items` + `categories` and falls back to
 * empty arrays when the network call hasn't returned yet.
 *
 * Categories are database-driven rather than hardcoded, so the public menu
 * can render any category present in the database.
 *
 * Each menu item has a `photoSize` field ("small" | "medium" | "large" |
 * "feature") that controls how its thumbnail renders in the menu + gallery.
 */
import { useQuery } from "@tanstack/react-query";

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
  showInGallery: boolean;
};

export type MenuCategoryDTO = {
  key: string;
  labelFr: string;
  labelEn: string;
  displayOrder: number;
};

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

export function useMenu() {
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

  };
}
"use client";

/**
 * useSettings — fetches the owner-editable SiteSettings row (story title,
 * body text, photo). Falls back to `null` when nothing's been set yet, so
 * callers should fall back to the hardcoded translation strings.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type SiteSettingsDTO = {
  id: number;
  storyTitleFr: string | null;
  storyTitleEn: string | null;
  storyBodyFr1: string | null;
  storyBodyEn1: string | null;
  storyBodyFr2: string | null;
  storyBodyEn2: string | null;
  storyPhotoUrl: string | null;
} | null;

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || "";
}

async function fetchSettings(): Promise<SiteSettingsDTO> {
  const r = await fetch("/api/settings", { cache: "no-store" });
  if (!r.ok) throw new Error(`Settings fetch failed: ${r.status}`);
  return r.json();
}

async function patchSettings(
  patch: Partial<NonNullable<SiteSettingsDTO>>
): Promise<SiteSettingsDTO> {
  const r = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`Settings update failed: ${r.status}`);
  return r.json();
}

export function useSettings() {
  const qc = useQueryClient();
  const key = ["site-settings"];

  const query = useQuery<SiteSettingsDTO>({
    queryKey: key,
    queryFn: fetchSettings,
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: patchSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    settings: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    patchSettings: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
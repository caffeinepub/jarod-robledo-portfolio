import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Photo } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetAllPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      if (!actor) return [];
      const photos = await actor.getAllPhotos();
      return [...photos].sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPhoto() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      category,
      file,
      onProgress,
    }: {
      title: string;
      category: string;
      file: File;
      onProgress?: (pct: number) => void;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const bytes = new Uint8Array(await file.arrayBuffer());
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) blob = blob.withUploadProgress(onProgress);
      return actor.addPhoto(title, category, blob);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

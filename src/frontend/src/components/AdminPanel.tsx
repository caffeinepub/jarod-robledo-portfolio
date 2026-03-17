import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddPhoto,
  useDeletePhoto,
  useGetAllPhotos,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Architecture",
  "Interior Design",
  "Renders",
  "Photography",
  "Other",
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function fileNameToTitle(filename: string): string {
  const noExt = filename.replace(/\.[^.]+$/, "");
  const spaced = noExt.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { data: photos, isLoading } = useGetAllPhotos();
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // Auto-fill title from filename if title is empty
    if (!title.trim()) {
      setTitle(fileNameToTitle(f.name));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a photo to upload.");
      return;
    }

    const resolvedTitle = title.trim() || fileNameToTitle(file.name);
    const resolvedCategory = category || "Other";

    try {
      setProgress(0);
      await addPhoto.mutateAsync({
        title: resolvedTitle,
        category: resolvedCategory,
        file,
        onProgress: setProgress,
      });
      toast.success("Photo uploaded successfully.");
      setTitle("");
      setCategory("");
      setFile(null);
      setPreview(null);
      setProgress(0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg &&
        (msg.includes("Unauthorized") || msg.toLowerCase().includes("admin"))
      ) {
        toast.error(
          "Upload failed: You need admin access. Please make sure you're using the admin link to access this site.",
        );
      } else if (msg) {
        toast.error(`Upload failed: ${msg}`);
      } else {
        toast.error("Upload failed. Please try again.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto.mutateAsync(id);
      toast.success("Photo deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Dashboard
            </p>
            <h1 className="font-display text-4xl font-medium">Admin Panel</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close admin"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[380px,1fr] gap-12">
          {/* Upload Form */}
          <div>
            <h2 className="font-display text-xl font-medium mb-6">
              Upload Photo
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Dropzone */}
              <label
                data-ocid="admin.dropzone"
                htmlFor="dropzone-file"
                className={`block border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-muted-foreground"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon size={32} strokeWidth={1} />
                    <p className="text-sm">
                      Drop photo here or click to browse
                    </p>
                    <p className="text-xs">JPG, PNG, WEBP supported</p>
                  </div>
                )}
              </label>
              <input
                id="dropzone-file"
                data-ocid="admin.upload_button"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              <div>
                <Label
                  htmlFor="photo-title"
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Title{" "}
                  <span className="normal-case tracking-normal opacity-60">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="photo-title"
                  data-ocid="admin.title_input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Auto-filled from filename if blank"
                  className="mt-1 rounded-none"
                />
              </div>

              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Category{" "}
                  <span className="normal-case tracking-normal opacity-60">
                    (optional — defaults to Other)
                  </span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    data-ocid="admin.category_select"
                    className="mt-1 rounded-none"
                  >
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress */}
              {addPhoto.isPending && (
                <div data-ocid="upload.loading_state">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Uploading…</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1 rounded-none" />
                </div>
              )}

              {addPhoto.isSuccess && (
                <p
                  data-ocid="upload.success_state"
                  className="text-xs text-green-600 tracking-wide"
                >
                  Upload complete!
                </p>
              )}

              {addPhoto.isError && (
                <p
                  data-ocid="upload.error_state"
                  className="text-xs text-destructive tracking-wide"
                >
                  Upload failed — please try again.
                </p>
              )}

              <Button
                data-ocid="admin.submit_button"
                type="submit"
                disabled={addPhoto.isPending}
                className="rounded-none bg-foreground text-primary-foreground hover:bg-foreground/90 text-xs tracking-widest uppercase gap-2"
              >
                <Upload size={14} />
                {addPhoto.isPending ? "Uploading…" : "Upload Photo"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Accepts JPG, PNG, and WEBP images
              </p>
            </form>
          </div>

          {/* Photos Grid */}
          <div>
            <h2 className="font-display text-xl font-medium mb-6">
              All Photos
              {photos && (
                <span className="text-muted-foreground text-base font-sans ml-2">
                  ({photos.length})
                </span>
              )}
            </h2>

            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="aspect-square" />
                ))}
              </div>
            )}

            {!isLoading && (!photos || photos.length === 0) && (
              <div
                data-ocid="admin.photos.empty_state"
                className="border border-dashed border-border p-12 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  No photos uploaded yet. Use the form to add your first photo.
                </p>
              </div>
            )}

            {!isLoading && photos && photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="group relative">
                    <img
                      src={photo.blobKey.getDirectURL()}
                      alt={photo.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all flex items-start justify-end p-2">
                      <button
                        type="button"
                        data-ocid={`admin.photo_delete_button.${i + 1}`}
                        onClick={() => handleDelete(photo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-none p-1.5 hover:bg-destructive/80"
                        aria-label="Delete photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <p className="text-xs font-medium truncate">
                        {photo.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {photo.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
}

export const ChatFileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.url) {
        setPreviewUrl(data.url);
        onUploadComplete(data.url); // Notify parent
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
         <Plus />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          // accept="image/*"
          className="hidden"
        />
        {isUploading && <Loader2 className="animate-spin w-5 h-5 text-muted" />}
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Uploaded Preview"
          className="max-w-xs mt-2 rounded-lg border"
        />
      )}
    </div>
  );
};

// "use client";

// import { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2, Plus } from "lucide-react";

// interface FileUploaderProps {
//   onUploadComplete: (url: string) => void;
// }

// export const ChatFileUploader = ({ onUploadComplete }: FileUploaderProps) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (data?.url) {
//         setPreviewUrl(data.url);
//         onUploadComplete(data.url); // Notify parent
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex items-center gap-2">
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           disabled={isUploading}
//         >
//          <Plus className="h-9 w-9 hover:bg-gray-200 p-2 rounded-full font-extrabold   text-black"/>
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept="image/*"
//           className="hidden"
//         />
//         {isUploading && <Loader2 className="animate-spin w-5 h-5 text-muted" />}
//       </div>
//     </div>
//   );
// };


"use client";

import { useRef, useState } from "react";
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

    try {
      const compressedFile = await compressImage(file, 512, 0.6);

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.url) {
        setPreviewUrl(data.url);
        onUploadComplete(data.url);
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
          <Plus className="h-9 w-9 hover:bg-gray-200 p-2 rounded-full text-black" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading && <Loader2 className="text-black animate-spin w-10 h-10 " />}
      </div>

      {/* {previewUrl && (
        <img src={previewUrl} alt="Uploaded preview" className="w-24 h-24 rounded" />
      )} */}
    </div>
  );
};

// 🔧 Helper function to compress the image
async function compressImage(
  file: File,
  maxSize = 512,
  quality = 0.6
): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = maxSize;
  canvas.height = maxSize;

  ctx?.drawImage(imageBitmap, 0, 0, maxSize, maxSize);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const compressed = new File([blob!], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      resolve(compressed);
    }, "image/jpeg", quality);
  });
}

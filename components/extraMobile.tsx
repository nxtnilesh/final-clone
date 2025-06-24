import React from "react";
import { BarChart3, Eye, FileText, ImageIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function ExtraMobile() {
  const handleBadgeClick = (label: string) => {
    toast(`${label} - demo`);
    console.log("test");
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 mt-12 mb-4">
      <Toaster />
      <div className="flex justify-center gap-3 mb-3">
        <Badge
          onClick={() => handleBadgeClick("Create image")}
          variant="outline"
          className="cursor-pointer border-muted-foreground text-foreground hover:bg-muted h-9 px-3 inline-flex items-center gap-2 text-sm w-fit dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <ImageIcon className="h-4 w-4 text-green-500" />
          Create image
        </Badge>

        <Badge
          onClick={() => handleBadgeClick("Summarize text")}
          variant="outline"
          className="cursor-pointer border-muted-foreground text-foreground hover:bg-muted h-9 px-3 inline-flex items-center gap-2 text-sm w-fit dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <FileText className="h-4 w-4 text-orange-500" />
          Summarize text
        </Badge>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        <Badge
          onClick={() => handleBadgeClick("Analyze data")}
          variant="outline"
          className="cursor-pointer border-muted-foreground text-foreground hover:bg-muted h-9 px-3 inline-flex items-center gap-2 text-sm w-fit dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <BarChart3 className="h-4 w-4 text-blue-500" />
          Analyze data
        </Badge>

        <Badge
          onClick={() => handleBadgeClick("Analyze images")}
          variant="outline"
          className="cursor-pointer border-muted-foreground text-foreground hover:bg-muted h-9 px-3 inline-flex items-center gap-2 text-sm w-fit dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <Eye className="h-4 w-4 text-purple-500" />
          Analyze images
        </Badge>

        <Badge
          onClick={() => handleBadgeClick("More")}
          variant="outline"
          className="cursor-pointer border-muted-foreground text-foreground hover:bg-muted h-9 px-3 inline-flex items-center justify-center text-sm w-fit dark:border-gray-600 dark:hover:bg-gray-800"
        >
          More
        </Badge>
      </div>
    </div>
  );
}

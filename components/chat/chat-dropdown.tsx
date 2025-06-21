import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit2, Trash2, Share2 } from "lucide-react";

export function ChatActionsDropdown({
  onRename,
  onDelete,
  onShare,
}: {
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
          <Ellipsis className=" w-4 h-4 opacity-0 group-hover/chat-btn:opacity-100 transition-opacity duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-32 rounded-2xl bg-neutral-700 px-3 py-2">
        <DropdownMenuItem onClick={onRename}>
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-700 "
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



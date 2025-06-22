import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit2, Trash2, Share2 } from "lucide-react";
import { DeleteChatDialog } from "../deletec-chat-dialog";

export function ChatActionsDropdown({
  onRename,
  onDelete,
  onShare,
  chatName
}: {
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  chatName: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
          <Ellipsis className=" w-4 h-4 opacity-0 group-hover/chat-btn:opacity-100 transition-opacity duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-32 rounded-2xl  px-3 py-2">
        <DropdownMenuItem onClick={onRename}>
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={onDelete}
          className="text-red-700 "
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem> */}
         <DeleteChatDialog  onDelete={onDelete} chatName={chatName} />
         
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



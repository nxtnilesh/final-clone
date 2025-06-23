import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit2, Share2 } from "lucide-react";
import { DeleteChatDialog } from "../deletec-chat-dialog";
import { useState } from "react";

export function ChatActionsDropdown({
  onRename,
  onDelete,
  onShare,
  chatName,
}: {
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  chatName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
          <Ellipsis className="w-4 h-4 sm:opacity-0 sm:group-hover/chat-btn:opacity-100 transition-opacity duration-200 dark:text-white " />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-32 rounded-2xl px-3 py-2 bg-white dark:bg-neutral-900 text-black dark:text-white"
      >
        <DropdownMenuItem
          onClick={() => {
            onRename();
            setOpen(false);
          }}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            onShare();
            setOpen(false);
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>

        <div className="mt-1">
          <DeleteChatDialog
            onDelete={() => {
              onDelete();
              setOpen(false);
            }}
            chatName={chatName}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

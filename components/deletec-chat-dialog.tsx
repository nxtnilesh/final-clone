"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteChatDialogProps {
  chatName: string;
  onDelete: () => void;
}

export function DeleteChatDialog({ chatName, onDelete }: DeleteChatDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="hover:text-red-600 dark:hover:text-red-500">
          Delete Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-900 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Delete chat?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 dark:text-gray-300 space-y-2">
          <p>
            This will delete <span className="font-bold">{chatName}</span>.
          </p>
          <p>
            Visit
            <a
              href="/settings"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-500"
            >
              settings
            </a>
            to delete any memories saved during this chat.
          </p>
        </DialogDescription>
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-md text-black dark:text-white border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

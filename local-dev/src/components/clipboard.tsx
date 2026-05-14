"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/toast";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function useCopyToClipboard() {
  const { addToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (text: string, id?: string) => {
      navigator.clipboard.writeText(text).then(
        () => {
          if (id) setCopiedId(id);
          addToast({ type: "success", title: "Copied", message: "Copied to clipboard" });
          if (id) setTimeout(() => setCopiedId(null), 2000);
        },
        () => {
          addToast({ type: "error", title: "Failed", message: "Could not copy to clipboard" });
        }
      );
    },
    [addToast]
  );

  return { copy, copiedId };
}

interface CopyButtonProps {
  text: string;
  id?: string;
  className?: string;
}

export function CopyButton({ text, id, className }: CopyButtonProps) {
  const { copy, copiedId } = useCopyToClipboard();
  const isCopied = id ? copiedId === id : false;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(text, id);
      }}
      className={cn(
        "p-1.5 rounded border border-outline-variant/20 bg-[#0e0e0e] opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary hover:border-primary/30",
        className
      )}
      aria-label="Copy to clipboard"
    >
      {isCopied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

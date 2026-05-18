"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/capsule.actions";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  memoryId: string;
  initialIsFavorite: boolean;
  className?: string;
}

export function FavoriteButton({ memoryId, initialIsFavorite, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPending) return;
    
    // Optimistic update
    setIsFavorite(!isFavorite);
    setIsPending(true);

    const result = await toggleFavorite(memoryId);
    
    if (result.error) {
      // Revert on error
      setIsFavorite(isFavorite);
    }
    
    setIsPending(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "rounded-full p-1.5 transition-all hover:scale-110",
        isFavorite ? "text-foreground bg-surface/80" : "text-foreground/40 bg-surface/40 hover:text-foreground",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-foreground text-foreground" : "fill-transparent")}
      />
    </button>
  );
}

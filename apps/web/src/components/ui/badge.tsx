import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-label-md uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary border border-primary/30 bg-primary/5",
        secondary: "text-on-surface-variant border border-outline-variant",
        destructive: "text-destructive border border-destructive/30 bg-destructive/5",
        outline: "text-on-surface border border-outline-variant",
        warning: "text-[#ffc551] border border-[#ffc551]/30 bg-[#ffc551]/5",
        success: "text-green-400 border border-green-400/30 bg-green-400/5",
      },
      size: {
        default: "px-2 py-0.5 text-[11px]",
        sm: "px-1.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

"use client";
import { type HTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"


const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }


type BannerVariant = "rainbow" | "normal";

export function Banner({
  id,
  variant = "normal",
  height = "3rem",
  rainbowColors = [
    "rgba(0,149,255,0.56)",
    "rgba(231,77,255,0.77)",
    "rgba(255,0,0,0.73)",
    "rgba(131,255,166,0.66)",
  ],
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  height?: string;
  variant?: BannerVariant;
  rainbowColors?: string[];
}) {
  return (
    <div
      id={id}
      {...props}
      className={cn(
        "sticky top-0 z-50 flex flex-row items-center justify-center px-4 text-center text-sm font-medium",
        variant === "normal" && "bg-secondary dark:bg-slate-800 text-secondary-foreground dark:text-white",
        variant === "rainbow" && "bg-white dark:bg-black text-black dark:text-white",
        props.className,
      )}
      style={{
        height,
      }}
    >
      {variant === "rainbow"
        ? flow({
            colors: rainbowColors,
          })
        : null}
      {props.children}
    </div>
  );
}

const maskImage =
  "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)";

function flow({ colors }: { colors: string[] }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={
          {
            maskImage,
            maskComposite: "intersect",
            animation: "fd-moving-banner 20s linear infinite",
            backgroundImage: `repeating-linear-gradient(70deg, ${[...colors, colors[0]].map((color, i) => `${color} ${(i * 50) / colors.length}%`).join(", ")})`,
            backgroundSize: "200% 100%",
            filter: "saturate(2)",
          } as object
        }
      />
      <style>
        {`@keyframes fd-moving-banner {
            from { background-position: 0% 0;  }
            to { background-position: 100% 0;  }
         }`}
      </style>
    </>
  );
}

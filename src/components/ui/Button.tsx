import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-brand-900 text-white hover:bg-brand-700",
        gold: "bg-gold-500 text-brand-900 hover:bg-gold-600",
        outline: "border-2 border-brand-900 text-brand-900 hover:bg-brand-100 bg-transparent",
        ghost: "text-brand-900 hover:bg-brand-100 bg-transparent",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "px-5 py-3 text-base min-h-12",
        lg: "px-7 py-4 text-lg min-h-14",
        sm: "px-4 py-2 text-sm min-h-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonStyles> & { className?: string };

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { className, variant, size, ...rest } = props;

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <Link
        href={href}
        className={cn(buttonStyles({ variant, size }), className)}
        {...anchorRest}
      />
    );
  }

  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}

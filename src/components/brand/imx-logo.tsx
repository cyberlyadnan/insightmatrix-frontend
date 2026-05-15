import Image from "next/image";
import Link from "next/link";

import { IMX_LOGO } from "@/constants/branding";
import { cn } from "@/lib/utils";

/** `light` = light/white page background → dark logo. `dark` = dark background → white logo. */
export type ImxLogoSurface = "light" | "dark";

const sizeClasses = {
  xs: "h-6 w-auto max-w-[5.5rem] sm:max-w-[6.5rem]",
  sm: "h-8 w-auto max-w-[7.5rem] sm:max-w-[9rem]",
  md: "h-10 w-auto max-w-[9rem] sm:max-w-[11rem]",
  lg: "h-12 w-auto max-w-[10.5rem] sm:max-w-[13rem]",
  xl: "h-14 w-auto max-w-[12rem] sm:max-w-[15rem]",
} as const;

export type ImxLogoProps = {
  surface: ImxLogoSurface;
  size?: keyof typeof sizeClasses;
  className?: string;
  href?: string | null;
  priority?: boolean;
};

export function ImxLogo({
  surface,
  size = "md",
  className,
  href = "/",
  priority = false,
}: ImxLogoProps) {
  const src = surface === "light" ? IMX_LOGO.onLightBackground : IMX_LOGO.onDarkBackground;

  const image = (
    <Image
      src={src}
      alt="InsightMatrix"
      width={320}
      height={80}
      priority={priority}
      className={cn("object-contain object-left", sizeClasses[size], className)}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded-lg"
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}

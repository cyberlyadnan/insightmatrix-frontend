"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { vendorOutlineButtonClass } from "@/constants/vendor-ui";
import { cn } from "@/lib/utils";

export function CopyRoutingLinkButton({
  routingLink,
  className,
}: {
  routingLink: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(routingLink);
      setCopied(true);
      toast.success("Routing link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 px-4 text-sm",
        vendorOutlineButtonClass,
        className
      )}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy routing link"}
    </button>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={
          "flex max-h-[min(90dvh,720px)] w-[min(100%,calc(100vw-1.5rem))] min-w-0 max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-full"
        }
      >
        <DialogHeader className="shrink-0 space-y-1.5 px-4 pb-2 pt-5 text-left sm:px-6 sm:pt-6 sm:pr-14">
          <DialogTitle className="min-w-0 pr-8 text-base leading-snug sm:text-lg">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="min-w-0 text-pretty text-sm leading-relaxed">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
          {children}
        </div>
        {footer ? (
          <DialogFooter className="mt-0 shrink-0 gap-2 border-t border-gray-100 bg-gray-50/90 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

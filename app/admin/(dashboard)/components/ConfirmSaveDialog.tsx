"use client";

import { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

type ConfirmSaveDialogProps = {
  formId: string;
  triggerLabel: string;
  confirmLabel?: string;
  description: ReactNode;
  pending?: boolean;
  submitButtonId?: string;
};

export function ConfirmSaveDialog({
  formId,
  triggerLabel,
  confirmLabel,
  description,
  pending = false,
  submitButtonId,
}: ConfirmSaveDialogProps) {
  const triggerText = pending ? "جاري الحفظ..." : triggerLabel;
  const confirmText = pending ? "جارٍ الحفظ..." : confirmLabel ?? "تأكيد الحفظ";

  const handleConfirm = () => {
    if (submitButtonId) {
      document.getElementById(submitButtonId)?.click();
    } else {
      (document.getElementById(formId) as HTMLFormElement | null)?.requestSubmit();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm"
        >
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد الحفظ</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>إلغاء</AlertDialogCancel>
          <AlertDialogAction type="button" disabled={pending} onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


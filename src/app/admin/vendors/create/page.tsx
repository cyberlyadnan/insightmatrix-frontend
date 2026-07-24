"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { VendorForm, emptyVendorFormValues } from "@/components/admin/vendor-form";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { createVendor, type CreateVendorPayload } from "@/services/vendor";
import { queryKeys } from "@/services/queries";
import { vendorCallbackUrlsToPayload } from "@/utils/vendor-callback";
import type { VendorFormValues } from "@/validations";

function toPayload(values: VendorFormValues): CreateVendorPayload {
  return {
    companyName: values.companyName.trim(),
    contactPerson: values.contactPerson?.trim() || undefined,
    email: values.email.trim(),
    password: values.password?.trim() ?? "",
    phone: values.phone?.trim() || undefined,
    website: values.website?.trim() || undefined,
    callbackUrls: vendorCallbackUrlsToPayload(values.callbackUrls),
    notes: values.notes?.trim() || undefined,
    status: values.status,
  };
}

export default function CreateVendorPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const continueRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (payload: CreateVendorPayload) => createVendor(payload),
    onSuccess: async (vendor) => {
      crmToast.saved();
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.all });
      if (continueRef.current) {
        router.push(ROUTES.admin.vendorEdit(vendor.id));
      } else {
        router.push(ROUTES.admin.vendor(vendor.id));
      }
    },
    onError: (error) => toast.error(parseApiError(error, "Could not create vendor")),
  });

  return (
    <div className="w-full space-y-8 pb-8">
      <div>
        <Link
          href={ROUTES.admin.vendors}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vendors
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add vendor</h1>
        <p className="text-gray-500 font-medium mt-1">
          Create a B2B subpanel partner account with its own vendor portal login.
        </p>
      </div>

      <VendorForm
        mode="create"
        defaultValues={emptyVendorFormValues}
        onSubmit={(values, { continueEditing }) => {
          continueRef.current = continueEditing;
          mutation.mutate(toPayload(values));
        }}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}

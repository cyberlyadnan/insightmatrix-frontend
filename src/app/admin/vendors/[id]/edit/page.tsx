"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { VendorForm, vendorToFormValues } from "@/components/admin/vendor-form";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { getVendor, updateVendor, type UpdateVendorPayload } from "@/services/vendor";
import { queryKeys } from "@/services/queries";
import { vendorCallbackUrlsToPayload } from "@/utils/vendor-callback";
import type { VendorFormValues } from "@/validations";

function toUpdatePayload(values: VendorFormValues): UpdateVendorPayload {
  const payload: UpdateVendorPayload = {
    companyName: values.companyName.trim(),
    contactPerson: values.contactPerson?.trim() || undefined,
    email: values.email.trim(),
    phone: values.phone?.trim() || undefined,
    website: values.website?.trim() || undefined,
    callbackUrls: vendorCallbackUrlsToPayload(values.callbackUrls),
    notes: values.notes?.trim() || undefined,
    status: values.status,
  };
  const nextPassword = values.password?.trim();
  if (nextPassword) payload.password = nextPassword;
  return payload;
}

export default function EditVendorPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const qc = useQueryClient();

  const {
    data: vendor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.vendors.detail(id),
    queryFn: () => getVendor(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateVendorPayload) => updateVendor(id, payload),
    onSuccess: async () => {
      toast.success("Vendor updated");
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.all });
      router.push(ROUTES.admin.vendor(id));
    },
    onError: (error) => toast.error(parseApiError(error, "Could not update vendor")),
  });

  if (!id) {
    return <p className="text-sm text-gray-500">Invalid vendor.</p>;
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        <div className="h-40 bg-gray-100 rounded-[2rem]" />
        <div className="h-40 bg-gray-100 rounded-[2rem]" />
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <div className="w-full">
        <p className="text-gray-600 font-medium">Vendor not found.</p>
        <Link
          href={ROUTES.admin.vendors}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-8">
      <div>
        <Link
          href={ROUTES.admin.vendor(id)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit vendor</h1>
        <p className="text-gray-500 font-medium mt-1">{vendor.companyName}</p>
      </div>

      <VendorForm
        mode="edit"
        vendorCode={vendor.vendorCode}
        defaultValues={vendorToFormValues(vendor)}
        onSubmit={(values) => mutation.mutate(toUpdatePayload(values))}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}

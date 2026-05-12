"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { getCallbackConfig } from "@/constants/survey-callback";
import {
  pickSupplierParticipantRef,
  postPublicRoutingCallback,
  searchParamsToObject,
} from "@/lib/survey-callback-api";

const MISSING_PID_MESSAGE =
  "Missing partner project id. Suppliers must append the same pid= value as on the survey entry URL (stored as Partner project ID in admin).";

function useSessionDedupeRecorded(dedupeKey: string): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(dedupeKey) !== null;
      } catch {
        return false;
      }
    },
    () => false
  );
}

function CallbackPostRecorder({
  pid,
  searchParams,
  cfg,
  dedupeKey,
}: {
  pid: string;
  searchParams: ReturnType<typeof useSearchParams>;
  cfg: NonNullable<ReturnType<typeof getCallbackConfig>>;
  dedupeKey: string;
}) {
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("Recording your session…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ref = pickSupplierParticipantRef(searchParams);
        const quotaGroupId =
          searchParams.get("quotaGroupId")?.trim() ||
          searchParams.get("gid")?.trim() ||
          null;

        await postPublicRoutingCallback({
          supplierProjectPid: pid,
          eventType: cfg.eventType,
          quotaGroupId,
          supplierParticipantRef: ref || null,
          meta: { query: searchParamsToObject(searchParams) },
        });

        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(dedupeKey, "1");
        }
        if (!cancelled) {
          setStatus("ok");
          setMessage("Thank you — your outcome has been recorded. You can close this page.");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("err");
          setMessage(e instanceof Error ? e.message : "Could not record callback.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cfg.eventType, dedupeKey, pid, searchParams]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-[2rem] border border-gray-100 bg-white p-8 md:p-10 shadow-sm text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-6" />
            <h1 className="text-lg font-black text-gray-900 mb-2">{cfg.shortLabel}</h1>
            <p className="text-sm text-gray-600">{message}</p>
          </>
        ) : status === "ok" ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-lg font-black text-gray-900 mb-2">{cfg.shortLabel}</h1>
            <p className="text-sm text-gray-600">{message}</p>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-6" />
            <h1 className="text-lg font-black text-gray-900 mb-2">Could not record</h1>
            <p className="text-sm text-gray-600">{message}</p>
          </>
        )}
        <p className="text-[11px] text-gray-400 mt-8 leading-relaxed">
          InsightMatrix routing callback · {cfg.label}
        </p>
      </div>
    </div>
  );
}

export function SurveyCallbackRecorder({ outcome }: { outcome: string }) {
  const searchParams = useSearchParams();
  const cfg = getCallbackConfig(outcome);
  const pid = searchParams.get("pid")?.trim();
  const dedupeKey = `im-routing-cb:${outcome}:${searchParams.toString()}`;
  const alreadyRecorded = useSessionDedupeRecorded(dedupeKey);

  if (!cfg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <XCircle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-gray-900 font-bold">This callback URL is not valid.</p>
      </div>
    );
  }

  if (!pid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-[2rem] border border-gray-100 bg-white p-8 md:p-10 shadow-sm text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-6" />
          <h1 className="text-lg font-black text-gray-900 mb-2">Could not record</h1>
          <p className="text-sm text-gray-600">{MISSING_PID_MESSAGE}</p>
          <p className="text-[11px] text-gray-400 mt-8 leading-relaxed">
            InsightMatrix routing callback · {cfg.label}
          </p>
        </div>
      </div>
    );
  }

  if (alreadyRecorded) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-[2rem] border border-gray-100 bg-white p-8 md:p-10 shadow-sm text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-lg font-black text-gray-900 mb-2">{cfg.shortLabel}</h1>
          <p className="text-sm text-gray-600">
            This redirect was already recorded in your browser session.
          </p>
          <p className="text-[11px] text-gray-400 mt-8 leading-relaxed">
            InsightMatrix routing callback · {cfg.label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CallbackPostRecorder pid={pid} searchParams={searchParams} cfg={cfg} dedupeKey={dedupeKey} />
  );
}

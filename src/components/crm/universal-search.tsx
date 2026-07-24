"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardList, Loader2, Search, Store, Users } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { listPanelSurveys } from "@/services/panel-survey";
import { listSurveyCompanies } from "@/services/survey-company";
import { listSurveyRespondentProfiles } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { listVendors } from "@/services/vendor";
import { resolveTrackingParticipantId } from "@/lib/survey-respondent-tracking";
import { cn } from "@/lib/utils";

type SearchHit = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
};

type SearchGroups = {
  surveys: SearchHit[];
  vendors: SearchHit[];
  providers: SearchHit[];
  respondents: SearchHit[];
};

const EMPTY_GROUPS: SearchGroups = {
  surveys: [],
  vendors: [],
  providers: [],
  respondents: [],
};

async function runUniversalSearch(q: string): Promise<SearchGroups> {
  const query = q.trim();
  if (query.length < 1) return EMPTY_GROUPS;

  const params = { search: query, page: 1, pageSize: 5 } as const;

  const [surveysRes, vendorsRes, providersRes, respondentsRes] = await Promise.allSettled([
    listPanelSurveys(params),
    listVendors(params),
    listSurveyCompanies(params),
    listSurveyRespondentProfiles(params),
  ]);

  const surveys: SearchHit[] =
    surveysRes.status === "fulfilled"
      ? surveysRes.value.items.map((s) => ({
          id: s.id,
          label: s.surveyName,
          sublabel: [s.surveyCode, s.supplierProjectPid, s.externalSurveyId]
            .filter(Boolean)
            .join(" · "),
          href: ROUTES.admin.survey(s.id),
        }))
      : [];

  const vendors: SearchHit[] =
    vendorsRes.status === "fulfilled"
      ? vendorsRes.value.items.map((v) => ({
          id: v.id,
          label: v.companyName,
          sublabel: v.vendorCode,
          href: ROUTES.admin.vendor(v.id),
        }))
      : [];

  const providers: SearchHit[] =
    providersRes.status === "fulfilled"
      ? providersRes.value.items.map((c) => ({
          id: c.id,
          label: c.companyName,
          sublabel: c.companyCode,
          href: ROUTES.admin.company(c.id),
        }))
      : [];

  const respondents: SearchHit[] =
    respondentsRes.status === "fulfilled"
      ? respondentsRes.value.items.map((r) => {
          const tracking = resolveTrackingParticipantId(r);
          return {
            id: r.id,
            label: tracking || r.internalSessionToken || r.id,
            sublabel: [r.panelSurvey?.surveyName, r.surveyStatus].filter(Boolean).join(" · "),
            href: ROUTES.admin.surveyRespondent(r.id),
          };
        })
      : [];

  return { surveys, vendors, providers, respondents };
}

function totalHits(g: SearchGroups) {
  return g.surveys.length + g.vendors.length + g.providers.length + g.respondents.length;
}

type UniversalSearchProps = {
  className?: string;
};

/** Global CRM search across surveys, vendors, providers, and respondent tracking IDs. */
export function UniversalSearch({ className }: UniversalSearchProps) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 400);
    return () => window.clearTimeout(t);
  }, [query]);

  const { data: groups = EMPTY_GROUPS, isFetching } = useQuery({
    queryKey: ["admin-universal-search", debounced],
    queryFn: () => runUniversalSearch(debounced),
    enabled: debounced.length > 0,
    staleTime: 30_000,
  });

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const showPanel = open && query.trim().length > 0;
  const loading = debounced.length > 0 && isFetching;
  const empty = !loading && debounced.length > 0 && totalHits(groups) === 0;

  return (
    <div ref={containerRef} className={cn("relative max-w-md w-full", className)}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Universal Search…"
        className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={showPanel}
        role="combobox"
      />

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(28rem,70vh)] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : empty ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No matching results</p>
          ) : (
            <div className="py-2">
              <ResultGroup
                title="Surveys"
                icon={ClipboardList}
                items={groups.surveys}
                onSelect={navigate}
              />
              <ResultGroup
                title="Vendors"
                icon={Store}
                items={groups.vendors}
                onSelect={navigate}
              />
              <ResultGroup
                title="Providers"
                icon={Building2}
                items={groups.providers}
                onSelect={navigate}
              />
              <ResultGroup
                title="Tracking / Respondents"
                icon={Users}
                items={groups.respondents}
                onSelect={navigate}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ResultGroup({
  title,
  icon: Icon,
  items,
  onSelect,
}: {
  title: string;
  icon: typeof Search;
  items: SearchHit[];
  onSelect: (href: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="px-2 py-1">
      <p className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </p>
      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.id}`}>
            <button
              type="button"
              role="option"
              aria-selected={false}
              className="w-full text-left rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors"
              onClick={() => onSelect(item.href)}
            >
              <p className="text-sm font-semibold text-gray-900 truncate">{item.label}</p>
              {item.sublabel ? (
                <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{item.sublabel}</p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

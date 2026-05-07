"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Search,
  Clock,
  Trash2,
  Mail,
  ArrowRight,
  User,
  Star,
  Archive,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { parseApiError } from "@/services/api/errors";
import {
  deleteContactQuery,
  listContactQueries,
  type ContactQuery,
  updateContactQuery,
  updateContactQueryStatus,
} from "@/services/contact-query";
import { queryKeys } from "@/services/queries";

const LABEL_OPTIONS = ["Sales", "Support", "Partnership", "Technical", "Priority"];

function toDisplayStatus(status: ContactQuery["status"]) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "resolved") return "Resolved";
  if (status === "completed") return "Completed";
  if (status === "unread") return "Unread";
  return "Read";
}

export default function AdminQueries() {
  const qc = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [tab, setTab] = useState<"inbox" | "starred" | "archived">("inbox");
  const [statusFilter, setStatusFilter] = useState<
    "" | "pending" | "in_progress" | "resolved" | "completed" | "unread" | "read"
  >("");
  const [labelFilter, setLabelFilter] = useState("");

  const filters = useMemo(
    () => ({
      search,
      status: statusFilter || undefined,
      label: labelFilter || undefined,
      starred: tab === "starred" ? true : undefined,
      archived: tab === "archived" ? true : tab === "inbox" ? false : undefined,
    }),
    [search, statusFilter, labelFilter, tab]
  );

  const query = useInfiniteQuery({
    queryKey: queryKeys.contactQueries.list(filters),
    queryFn: ({ pageParam }) =>
      listContactQueries({ ...filters, page: Number(pageParam ?? 1), pageSize: 20 }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const page = last.meta?.page ?? 1;
      const totalPages = last.meta?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const queries = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data]
  );

  const activeSelectedId = selectedId ?? queries[0]?.id ?? null;
  const selectedQuery = queries.find((q) => q.id === activeSelectedId);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.contactQueries.all });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactQuery["status"] }) =>
      updateContactQueryStatus(id, status),
    onSuccess: refresh,
    onError: (error) => toast.error(parseApiError(error, "Could not update query")),
  });

  const patchMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<ContactQuery, "starred" | "archived" | "labels">>;
    }) => updateContactQuery(id, payload),
    onSuccess: refresh,
    onError: (error) => toast.error(parseApiError(error, "Could not update query")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContactQuery(id),
    onSuccess: async () => {
      toast.success("Query deleted");
      setSelectedId(null);
      await refresh();
    },
    onError: (error) => toast.error(parseApiError(error, "Could not delete query")),
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const item = queries.find((q) => q.id === id);
    if (item?.status === "unread") {
      statusMutation.mutate({ id, status: "in_progress" });
    }
    if (window.innerWidth < 1024) setViewState("detail");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
              Inbound Queries
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Review and respond to research requests and contact submissions.
            </p>
          </div>
          <div className="flex gap-2">
            {(["inbox", "starred", "archived"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  tab === item
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Filter queries..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | ""
                  | "pending"
                  | "in_progress"
                  | "resolved"
                  | "completed"
                  | "unread"
                  | "read"
              )
            }
            className="h-12 rounded-xl border border-gray-100 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            className="h-12 rounded-xl border border-gray-100 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All labels</option>
            {LABEL_OPTIONS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div
          className={`lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin ${viewState === "detail" ? "hidden lg:flex" : "flex"}`}
        >
          <div className="space-y-3 pb-20 lg:pb-0">
            {query.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-white border border-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-500 bg-white rounded-2xl border border-gray-100">
                No contact queries found.
              </div>
            ) : (
              <>
                {queries.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelect(q.id)}
                    className={`w-full p-5 md:p-6 rounded-3xl border text-left transition-all relative group ${
                      selectedId === q.id
                        ? "bg-white border-brand-primary shadow-xl shadow-brand-primary/5"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {q.status === "unread" && (
                      <div className="absolute top-6 right-6 w-2 h-2 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/40" />
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          q.status === "pending" || q.status === "unread"
                            ? "text-amber-500"
                            : q.status === "resolved" || q.status === "completed"
                              ? "text-emerald-500"
                              : "text-indigo-500"
                        }`}
                      >
                        {toDisplayStatus(q.status)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {new Date(q.createdAt ?? "").toLocaleString()}
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-black mb-1 truncate ${selectedId === q.id ? "text-brand-primary" : "text-gray-900"}`}
                    >
                      {q.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 truncate mb-2">{q.subject}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
                      {q.message}
                    </p>
                    {q.labels.length > 0 ? (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {q.labels.slice(0, 2).map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                ))}
                <div ref={loadMoreRef} className="h-8" />
                {query.isFetchingNextPage ? (
                  <div className="h-10 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                ) : null}
              </>
            )}
          </div>
        </div>

        <div
          className={`lg:col-span-8 min-h-0 ${viewState === "list" ? "hidden lg:block" : "block"}`}
        >
          <AnimatePresence mode="wait">
            {selectedQuery ? (
              <motion.div
                key={activeSelectedId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden"
              >
                <div className="p-5 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewState("list")}
                      className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-primary transition-all active:scale-95"
                    >
                      <X size={20} />
                    </button>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                      <User size={24} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-black text-gray-900 truncate">
                        {selectedQuery.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-xs font-bold text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} /> {selectedQuery.email}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock size={12} />{" "}
                          {new Date(selectedQuery.createdAt ?? "").toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 lg:self-start">
                    <button
                      onClick={() =>
                        patchMutation.mutate({
                          id: selectedQuery.id,
                          payload: { starred: !selectedQuery.starred },
                        })
                      }
                      className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-colors ${
                        selectedQuery.starred
                          ? "text-amber-500"
                          : "text-gray-400 hover:text-amber-500"
                      }`}
                    >
                      <Star size={20} fill={selectedQuery.starred ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() =>
                        patchMutation.mutate({
                          id: selectedQuery.id,
                          payload: { archived: !selectedQuery.archived },
                        })
                      }
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                      <Archive size={20} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(selectedQuery.id)}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <select
                      value={selectedQuery.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: selectedQuery.id,
                          status: e.target.value as ContactQuery["status"],
                        })
                      }
                      className="h-10 min-w-[170px] rounded-xl border border-gray-200 px-3 text-xs font-black uppercase tracking-widest text-gray-900 bg-white shadow-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="completed">Completed</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                  <div className="inline-block px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    Subject: {selectedQuery.subject}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {LABEL_OPTIONS.map((label) => {
                      const active = selectedQuery.labels.includes(label);
                      return (
                        <button
                          key={label}
                          onClick={() =>
                            patchMutation.mutate({
                              id: selectedQuery.id,
                              payload: {
                                labels: active
                                  ? selectedQuery.labels.filter((item) => item !== label)
                                  : [...selectedQuery.labels, label],
                              },
                            })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            active
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-600 border-gray-200"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-gray-700 font-medium leading-[1.8] text-base md:text-lg whitespace-pre-wrap">
                    {selectedQuery.message}
                  </p>
                  <div className="mt-12 md:mt-20 p-6 md:p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-10 md:mb-0">
                    <div className="text-center md:text-left">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Reply via Email
                      </div>
                      <div className="text-sm font-black text-gray-900 truncate max-w-[200px] md:max-w-none">
                        {selectedQuery.email}
                      </div>
                    </div>
                    <button className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200">
                      Compose Reply <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 h-full flex items-center justify-center flex-col text-gray-300 p-10 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
                  <MessageSquare size={40} className="opacity-50" />
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2">No Query Selected</h3>
                <p className="text-sm font-bold max-w-[200px]">
                  Select a query from the list to view details and respond.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

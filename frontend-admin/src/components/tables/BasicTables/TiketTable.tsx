import { useCallback, useEffect, useState } from "react";
import api from "../../../lib/api";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

export interface Ticket {
  id: string | number;
  nomorTiket?: string;
  noTiket?: string;
  pelapor: string | { name?: string; email?: string };
  kategori: string;
  status: "MENUNGGU" | "PROSES" | "SELESAI" | "Menunggu" | "Proses" | "Selesai" | string;
  agent: string;
  tanggal: string;
}

interface TicketsApiResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tickets: Ticket[];
}

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function TicketTable() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get<TicketsApiResponse | Ticket[]>("/api/admin/tickets", {
        params,
      });

      const responseData = response.data;

      if (Array.isArray(responseData)) {
        setTickets(responseData);
        setTotal(responseData.length);
        setTotalPages(Math.ceil(responseData.length / limit) || 1);
      } else if (responseData && Array.isArray(responseData.tickets)) {
        setTickets(responseData.tickets);
        setTotal(responseData.total ?? responseData.tickets.length);
        setTotalPages(responseData.totalPages ?? 1);
      } else {
        setTickets([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Error fetching ticket data:", err);
      const errMsg =
        err.response?.data?.error || "Gagal memuat data tiket dari server.";
      setError(errMsg);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/api/admin/export/csv", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Pengaduan_TTE_KKP_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor data tiket:", err);
      alert("Gagal mengunduh laporan CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const getPelaporInfo = (pelapor: Ticket["pelapor"]) => {
    if (!pelapor) {
      return { name: "Tanpa Nama", email: "", initial: "?" };
    }
    if (typeof pelapor === "string") {
      return {
        name: pelapor,
        email: "",
        initial: pelapor.trim().charAt(0).toUpperCase() || "?",
      };
    }
    return {
      name: pelapor.name || "Tanpa Nama",
      email: pelapor.email || "",
      initial: (pelapor.name || "?").trim().charAt(0).toUpperCase() || "?",
    };
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "SELESAI") {
      return (
        <Badge size="sm" color="success">
          Selesai
        </Badge>
      );
    }
    if (s === "PROSES") {
      return (
        <Badge size="sm" color="warning">
          Proses
        </Badge>
      );
    }
    return (
      <Badge size="sm" color="light">
        {status || "—"}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Filter based on selected status tab if filtered on client side
  const displayedTickets =
    statusFilter === "ALL"
      ? tickets
      : tickets.filter(
          (t) => (t.status || "").toUpperCase() === statusFilter.toUpperCase()
        );

  return (
    <div className="w-full space-y-4">
      {/* Header Toolbar: Search, Filter & Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 p-3">
          {[
            { key: "ALL", label: "Semua" },
            { key: "MENUNGGU", label: "Menunggu" },
            { key: "PROSES", label: "Proses" },
            { key: "SELESAI", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? "bg-[#1A3A5E] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2 p-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari no tiket / pelapor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-48 rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:w-60 focus:border-[#1A3A5E] focus:ring-1 focus:ring-[#1A3A5E] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:w-56"
            />
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            title="Ekspor data tiket ke CSV/Excel"
          >
            <svg
              className="h-3.5 w-3.5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">
              {isExporting ? "Mengekspor..." : "Ekspor CSV"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => fetchTickets()}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            title="Muat ulang data"
          >
            <svg
              className={`h-4 w-4 ${loading ? "animate-spin text-[#1A3A5E]" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchTickets()}
            className="font-medium underline hover:text-red-800"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-[#F0F6F8] dark:border-white/[0.05] dark:bg-white/[0.02]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  No Tiket
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Pelapor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Kategori
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Agent
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3.5 text-start text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Tanggal
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        className="h-6 w-6 animate-spin text-[#1A3A5E]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Memuat data tiket...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : displayedTickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Tidak ada tiket ditemukan
                      </p>
                      <p className="text-xs text-gray-400">
                        {search
                          ? `Tidak ada hasil untuk pencarian "${search}"`
                          : "Belum ada riwayat tiket dalam sistem."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedTickets.map((ticket) => {
                  const nomor = ticket.nomorTiket || ticket.noTiket || `#${ticket.id}`;
                  const pelaporInfo = getPelaporInfo(ticket.pelapor);
                  const avatarColor = getAvatarColor(pelaporInfo.name);

                  return (
                    <TableRow
                      key={ticket.id}
                      className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                    >
                      {/* Kolom No Tiket */}
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90 sm:px-6">
                        <span className="inline-block font-mono text-xs text-[#1A3A5E] dark:text-blue-400">
                          {nomor}
                        </span>
                      </TableCell>

                      {/* Kolom Pelapor (Avatar + Nama + Email) */}
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                          >
                            {pelaporInfo.initial}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {pelaporInfo.name}
                            </span>
                            {pelaporInfo.email && (
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {pelaporInfo.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Kolom Kategori */}
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                        {ticket.kategori || "—"}
                      </TableCell>

                      {/* Kolom Status */}
                      <TableCell className="px-5 py-4 text-start">
                        {renderStatusBadge(ticket.status)}
                      </TableCell>

                      {/* Kolom Agent */}
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ticket.agent && ticket.agent !== "—"
                                ? "bg-emerald-500"
                                : "bg-gray-300"
                            }`}
                          />
                          {ticket.agent || "—"}
                        </span>
                      </TableCell>

                      {/* Kolom Tanggal */}
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        {formatDate(ticket.tanggal)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-6 py-3.5 text-xs text-gray-500 dark:border-white/[0.05] dark:text-gray-400 sm:flex-row">
          <span>
            Menampilkan{" "}
            <strong className="font-semibold text-gray-700 dark:text-gray-200">
              {displayedTickets.length}
            </strong>{" "}
            dari{" "}
            <strong className="font-semibold text-gray-700 dark:text-gray-200">
              {total}
            </strong>{" "}
            tiket
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Sebelumnya
            </button>

            <span className="px-2 font-medium">
              Hal {page} dari {totalPages || 1}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
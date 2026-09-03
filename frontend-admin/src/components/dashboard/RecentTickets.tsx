import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/api";
import Badge from "../ui/badge/Badge";

export interface RecentTicket {
  id?: string | number;
  nomorTiket?: string;
  noTiket?: string;
  pelapor: string | { name?: string; email?: string; image?: string };
  kategori: string;
  status: string;
  agent: string;
  tanggal: string;
}

interface SummaryResponse {
  stats?: {
    total: number;
    menunggu: number;
    proses: number;
    selesai: number;
  };
  recentTickets?: RecentTicket[];
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

export default function RecentTickets() {
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<SummaryResponse>("/api/admin/summary");
      if (response.data && Array.isArray(response.data.recentTickets)) {
        setRecentTickets(response.data.recentTickets);
      } else {
        setRecentTickets([]);
      }
    } catch (err: any) {
      console.error("Error fetching recent tickets:", err);
      setError(
        err.response?.data?.error || "Gagal memuat data tiket terbaru."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentTickets();
  }, [fetchRecentTickets]);

  const getPelaporInfo = (pelapor: RecentTicket["pelapor"]) => {
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
    if (s === "MENUNGGU") {
      return (
        <Badge size="sm" color="info">
          Menunggu
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

  return (
    <div className="overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {error && (
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 p-4 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchRecentTickets}
            className="font-medium underline hover:text-red-800"
          >
            Coba Lagi
          </button>
        </div>
      )}

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
                  className="py-10 text-center text-sm text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-[#1A3A5E]"
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
                    <span>Memuat tiket terbaru...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : recentTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-gray-500"
                >
                  Belum ada tiket terbaru.
                </TableCell>
              </TableRow>
            ) : (
              recentTickets.map((ticket, index) => {
                const nomor =
                  ticket.nomorTiket ||
                  ticket.noTiket ||
                  `#${ticket.id || index + 1}`;
                const pelaporInfo = getPelaporInfo(ticket.pelapor);
                const avatarColor = getAvatarColor(pelaporInfo.name);

                return (
                  <TableRow
                    key={ticket.id || index}
                    className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    {/* Kolom No Tiket */}
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90 sm:px-6">
                      <span className="font-mono text-xs text-[#1A3A5E] dark:text-blue-400">
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
    </div>
  );
}
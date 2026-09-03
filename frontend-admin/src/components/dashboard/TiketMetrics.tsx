import { useEffect, useState } from "react";
import api from "../../lib/api";
import { BoxIconLine } from "../../icons";

interface DashboardStats {
  total: number;
  menunggu: number;
  proses: number;
  selesai: number;
}

export default function TiketMetrics() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    menunggu: 0,
    proses: 0,
    selesai: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/summary")
      .then((res) => {
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => {
        console.error("Error fetching metrics:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Metric 1: Total Tiket */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-900/20">
          <BoxIconLine className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Tiket
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.total.toLocaleString("id-ID")}
            </h4>
          </div>
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            Total
          </span>
        </div>
      </div>

      {/* Metric 2: Menunggu */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-xl dark:bg-sky-900/20">
          <svg
            className="text-sky-600 size-6 dark:text-sky-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Menunggu Respon
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.menunggu.toLocaleString("id-ID")}
            </h4>
          </div>
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
            Pending
          </span>
        </div>
      </div>

      {/* Metric 3: Sedang Proses */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl dark:bg-amber-900/20">
          <svg
            className="text-amber-500 size-6 dark:text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sedang Proses
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.proses.toLocaleString("id-ID")}
            </h4>
          </div>
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            Proses
          </span>
        </div>
      </div>

      {/* Metric 4: Tiket Selesai */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-900/20">
          <svg
            className="text-emerald-600 size-6 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tiket Selesai
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.selesai.toLocaleString("id-ID")}
            </h4>
          </div>
          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
            Selesai
          </span>
        </div>
      </div>
    </div>
  );
}
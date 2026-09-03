import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { CalenderIcon } from "../../icons";
import api from "../../lib/api";

interface TrendItem {
  key?: string;
  month?: string;
  label?: string;
  total: number;
  selesai: number;
}

interface SummaryData {
  stats?: {
    total: number;
    menunggu: number;
    proses: number;
    selesai: number;
  };
  trend?: TrendItem[];
  monthlyTrend?: TrendItem[];
}

type TabRange = "7d" | "30d" | "12m";

const formatMonthLabel = (monthKey: string) => {
  if (!monthKey || !monthKey.includes("-")) return monthKey;
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
};

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);
  const flatpickrInstanceRef = useRef<flatpickr.Instance | null>(null);

  const [activeTab, setActiveTab] = useState<TabRange>("12m");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendItem[]>([]);

  // Fetch summary data based on date range
  const fetchChartData = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await api.get<SummaryData>("/api/admin/summary", {
        params,
      });

      const rawTrend = response.data?.trend || response.data?.monthlyTrend;
      if (Array.isArray(rawTrend)) {
        setTrendData(rawTrend);
      } else {
        setTrendData([]);
      }
    } catch (err: any) {
      console.error("Error fetching statistics chart data:", err);
      setError(err.response?.data?.error || "Gagal memuat statistik tiket.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Flatpickr (NO altInput to prevent duplicate input clones)
  useEffect(() => {
    if (!datePickerRef.current) return;

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d M Y",
      clickOpens: true,
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const [start, end] = selectedDates;
          const startDateStr = start.toISOString().split("T")[0];
          const endDateStr = end.toISOString().split("T")[0];
          fetchChartData(startDateStr, endDateStr);
        }
      },
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          const [start, end] = selectedDates;
          const startDateStr = start.toISOString().split("T")[0];
          const endDateStr = end.toISOString().split("T")[0];
          fetchChartData(startDateStr, endDateStr);
        }
      },
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    flatpickrInstanceRef.current = Array.isArray(fp) ? fp[0] : fp;

    return () => {
      if (flatpickrInstanceRef.current) {
        flatpickrInstanceRef.current.destroy();
      }
    };
  }, [fetchChartData]);

  // Handle Quick Filter Tab Click
  const handleTabChange = (tab: TabRange) => {
    setActiveTab(tab);
    const today = new Date();
    let startDate: Date | undefined;

    if (tab === "7d") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (tab === "30d") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
    } else {
      // 12 months (default)
      startDate = undefined;
    }

    if (startDate) {
      const startStr = startDate.toISOString().split("T")[0];
      const endStr = today.toISOString().split("T")[0];
      if (flatpickrInstanceRef.current) {
        flatpickrInstanceRef.current.setDate([startDate, today]);
      }
      fetchChartData(startStr, endStr);
    } else {
      if (flatpickrInstanceRef.current) {
        flatpickrInstanceRef.current.clear();
      }
      fetchChartData();
    }
  };

  // Initial Load
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const categories = useMemo(
    () => trendData.map((item) => item.label || formatMonthLabel(item.month || "")),
    [trendData]
  );
  const totalData = useMemo(() => trendData.map((item) => item.total), [trendData]);
  const selesaiData = useMemo(() => trendData.map((item) => item.selesai), [trendData]);

  const series = useMemo(
    () => [
      {
        name: "Total Tiket Masuk",
        data: totalData.length > 0 ? totalData : [0],
      },
      {
        name: "Tiket Selesai",
        data: selesaiData.length > 0 ? selesaiData : [0],
      },
    ],
    [totalData, selesaiData]
  );

  const options: ApexOptions = useMemo(
    () => ({
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        fontFamily: "Outfit, sans-serif",
        labels: {
          colors: "#64748B",
        },
        markers: {
          size: 5,
        },
      },
      colors: ["#1A3A5E", "#10B981"],
      chart: {
        id: "ticket-trend-chart",
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "area",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        redrawOnParentResize: false,
        redrawOnWindowResize: true,
      },
      stroke: {
        curve: "smooth",
        width: [2.5, 2.5],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: "light",
        fixed: {
          enabled: false,
        },
        y: {
          formatter: (val?: number) => `${val ?? 0} tiket`,
        },
      },
      xaxis: {
        type: "category",
        categories:
          categories.length > 0
            ? categories
            : [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Mei",
                "Jun",
                "Jul",
                "Agu",
                "Sep",
                "Okt",
                "Nov",
                "Des",
              ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: "#64748B",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#64748B"],
          },
          formatter: (val?: number) => (val !== undefined ? Math.floor(val).toString() : "0"),
        },
        min: 0,
        forceNiceScale: true,
      },
    }),
    [categories]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik Tiket
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Tren volume tiket masuk dan penyelesaian berdasarkan periode waktu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Filter Tabs */}
          <div className="flex items-center rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
            {[
              { key: "7d", label: "7 Hari" },
              { key: "30d", label: "30 Hari" },
              { key: "12m", label: "12 Bulan" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key as TabRange)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date Picker Input (Single clean element) */}
          <div className="relative inline-flex items-center">
            <CalenderIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 dark:text-gray-400 z-10" />
            <input
              ref={datePickerRef}
              className="h-9 w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#1A3A5E] focus:ring-1 focus:ring-[#1A3A5E] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
              placeholder="Pilih rentang tanggal"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stable Chart Container (No scrollbar layout jitter) */}
      <div className="w-full overflow-hidden">
        {loading && trendData.length === 0 ? (
          <div className="flex h-[310px] items-center justify-center text-xs text-gray-400">
            <div className="flex items-center gap-2">
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
              <span>Memuat grafik statistik...</span>
            </div>
          </div>
        ) : (
          <Chart options={options} series={series} type="area" height={310} />
        )}
      </div>
    </div>
  );
}
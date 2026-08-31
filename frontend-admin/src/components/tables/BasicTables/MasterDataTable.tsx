import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

// 1. Interface untuk data Master
interface MasterDataItem {
  id: number;
  nama: string;
}

// 2. Dummy Data (Bisa diganti dengan state dari API nanti)
const unitKerjaData: MasterDataItem[] = [
  { id: 1, nama: "DIREKTORAT PERENCANAAN RUANG PERAIRAN" },
  { id: 2, nama: "Ditjen Perikanan Tangkap" },
  { id: 3, nama: "Ditjen Perikanan Budidaya" },
  { id: 4, nama: "Ditjen Penguatan Daya Saing Produk KP" },
  { id: 5, nama: "Ditjen Pengelolaan Kelautan dan Ruang Laut" },
  { id: 6, nama: "Inspektorat Jenderal" },
  { id: 7, nama: "Badan Riset dan SDM KP" },
  { id: 8, nama: "Ditjen Pengawasan SDKP" },
];

export default function MasterData() {
  // State untuk melacak Tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState("Unit Kerja");

  // Array nama tab untuk me-render tombol filter
  const tabs = ["Unit Kerja", "Eselon 1", "Kategori Kendala"];

  return (
    <div className="p-2 sm:p-6 w-full">

      {/* Tabs / Filter Navigasi */}
      <div className="flex justify-start mb-6">
        <div className="inline-flex bg-[#EBF1F5] rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === tab
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Card Kontainer Utama */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Card Header & Tombol Tambah */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {activeTab} ({activeTab === "Unit Kerja" ? unitKerjaData.length : 0})
          </h2>
          <button className="bg-[#1A3A5E] hover:bg-[#112740] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
            <span className="text-lg leading-none">+</span>
            Tambah {activeTab}
          </button>
        </div>

        {/* Tabel Data */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F4F7F9] border-b border-gray-100">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-6 py-3 font-semibold text-gray-600 text-start text-sm"
                >
                  Nama {activeTab}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-3 font-semibold text-gray-600 text-end text-sm"
                >
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {/* Logika Switcher: Hanya tampilkan data jika tab Unit Kerja aktif */}
              {activeTab === "Unit Kerja" ? (
                unitKerjaData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="px-6 py-4 text-sm text-gray-600 text-start">
                      {item.nama}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {/* Grup Tombol Aksi (Edit & Hapus) */}
                      <div className="flex items-center justify-end gap-3">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e0f2fe]/60 text-[#0284c7] hover:bg-[#e0f2fe] rounded-md text-xs font-medium transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fee2e2]/60 text-[#ef4444] hover:bg-[#fee2e2] rounded-md text-xs font-medium transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                /* Tampilan Kosong untuk Tab Lainnya (Eselon 1 / Kategori Kendala) */
                <TableRow>
                  <TableCell className="px-6 py-8 text-center text-gray-400 text-sm">
                    Data {activeTab} belum tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
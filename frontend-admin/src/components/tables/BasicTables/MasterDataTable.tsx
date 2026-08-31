import { FormEvent, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Form from "../../form/Form";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { Modal } from "../../ui/modal";

interface MasterDataItem {
  id: number;
  nama: string;
}

type MasterTab = "Unit Kerja" | "Eselon 1" | "Kategori Kendala";

const initialMasterData: Record<MasterTab, MasterDataItem[]> = {
  "Unit Kerja": [
    { id: 1, nama: "DIREKTORAT PERENCANAAN RUANG PERAIRAN" },
    { id: 2, nama: "Ditjen Perikanan Tangkap" },
    { id: 3, nama: "Ditjen Perikanan Budidaya" },
    { id: 4, nama: "Ditjen Penguatan Daya Saing Produk KP" },
    { id: 5, nama: "Ditjen Pengelolaan Kelautan dan Ruang Laut" },
    { id: 6, nama: "Inspektorat Jenderal" },
    { id: 7, nama: "Badan Riset dan SDM KP" },
    { id: 8, nama: "Ditjen Pengawasan SDKP" },
  ],
  "Eselon 1": [
    { id: 1, nama: "Kementerian Kelautan dan Perikanan" },
    { id: 2, nama: "Direktorat Jenderal Perikanan Tangkap" },
    { id: 3, nama: "Direktorat Jenderal Perikanan Budidaya" },
  ],
  "Kategori Kendala": [
    { id: 1, nama: "Kendala Sistem" },
    { id: 2, nama: "Kendala Data" },
    { id: 3, nama: "Kendala Proses" },
  ],
};

const tabs: MasterTab[] = ["Unit Kerja", "Eselon 1", "Kategori Kendala"];

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<MasterTab>("Unit Kerja");
  const [masterData, setMasterData] = useState<Record<MasterTab, MasterDataItem[]>>(
    initialMasterData,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const activeData = masterData[activeTab];
  const isEditMode = editingItemId !== null;

  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setNewName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MasterDataItem) => {
    setEditingItemId(item.id);
    setNewName(item.nama);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItemId(null);
    setNewName("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newName.trim();
    if (!trimmedName) {
      return;
    }

    setMasterData((prev) => {
      if (isEditMode && editingItemId !== null) {
        return {
          ...prev,
          [activeTab]: prev[activeTab].map((item) =>
            item.id === editingItemId ? { ...item, nama: trimmedName } : item,
          ),
        };
      }

      return {
        ...prev,
        [activeTab]: [
          ...prev[activeTab],
          {
            id: Date.now(),
            nama: trimmedName,
          },
        ],
      };
    });

    handleCloseModal();
  };

  return (
    <>
      <div className="w-full p-2 sm:p-6">
        <div className="mb-6 flex justify-start">
          <div className="inline-flex rounded-lg bg-[#EBF1F5] p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-5 py-1.5 text-sm font-medium transition-all ${
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

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">
              {activeTab} ({activeData.length})
            </h2>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A3A5E] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#112740]"
            >
              <span className="text-lg leading-none">+</span>
              Tambah {activeTab}
            </button>
          </div>

          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-[#F4F7F9]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start text-sm font-semibold text-gray-600"
                  >
                    Nama {activeTab}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-end text-sm font-semibold text-gray-600"
                  >
                    {""}
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100">
                {activeData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="px-6 py-4 text-start text-sm text-gray-600">
                      {item.nama}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#e0f2fe]/60 px-3 py-1.5 text-xs font-medium text-[#0284c7] transition-colors hover:bg-[#e0f2fe]"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#fee2e2]/60 px-3 py-1.5 text-xs font-medium text-[#ef4444] transition-colors hover:bg-[#fee2e2]"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A3A5E]">
              {isEditMode ? "Edit Data" : "Tambah Data"}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">{activeTab}</h3>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="master-data-name" className="text-gray-700">
                Nama {activeTab}
              </Label>
              <Input
                id="master-data-name"
                name="masterDataName"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder={`Masukkan nama ${activeTab.toLowerCase()}`}
                className="bg-white"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#1A3A5E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#112740]"
              >
                {isEditMode ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}
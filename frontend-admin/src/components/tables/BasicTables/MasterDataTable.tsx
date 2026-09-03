  import { FormEvent, useCallback, useEffect, useState } from "react";
import Form from "../../form/Form";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

  const API_BASE_URL =
    (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

  interface MasterDataItem {
    id: string;
    nama: string;
    kode?: string;
    eselon1Id?: string;
    eselon1?: { nama?: string };
  }

  type MasterTab = "Eselon 1" | "Unit Kerja" | "Kategori Kendala";

  const initialMasterData: Record<MasterTab, MasterDataItem[]> = {
    "Eselon 1": [],
    "Unit Kerja": [],
    "Kategori Kendala": [],
  };

  const tabs: MasterTab[] = ["Eselon 1", "Unit Kerja", "Kategori Kendala"];

  const endpointByTab = (tab: MasterTab) => {
    switch (tab) {
      case "Unit Kerja":
        return "/api/admin/unit-kerja";
      case "Eselon 1":
        return "/api/admin/eselon1";
      case "Kategori Kendala":
        return "/api/admin/kategori-kendala";
      default:
        return "/api/admin";
    }
  };

  const normalizeMasterItem = (record: unknown): MasterDataItem | null => {
    if (!record || typeof record !== "object") {
      return null;
    }

    const item = record as Record<string, unknown>;
    const idValue = item.id;
    const namaValue = item.nama;

    if (idValue === undefined || idValue === null) {
      return null;
    }

    const name = typeof namaValue === "string" ? namaValue.trim() : "";
    if (!name) {
      return null;
    }

    return {
      id: String(idValue),
      nama: name,
      kode: typeof item.kode === "string" ? item.kode : undefined,
      eselon1Id:
        typeof item.eselon1Id === "string" ? item.eselon1Id : undefined,
      eselon1:
        item.eselon1 && typeof item.eselon1 === "object"
          ? ({ nama: (item.eselon1 as { nama?: string }).nama })
          : undefined,
    };
  };

  const normalizeMasterData = (payload: unknown): MasterDataItem[] => {
    if (!Array.isArray(payload)) {
      return [];
    }

    return payload
      .map((item) => normalizeMasterItem(item))
      .filter((item): item is MasterDataItem => item !== null);
  };

  const buildUnitKerjaCode = (nama: string) => {
    const sanitized = nama
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);

    return sanitized || `UK-${Date.now().toString().slice(-6)}`;
  };

  const getToken = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return (
      localStorage.getItem("agent_token") ??
      localStorage.getItem("token") ??
      localStorage.getItem("adminToken") ??
      sessionStorage.getItem("token") ??
      ""
    );
  };

  async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers ?? {});

    if (!(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    const text = await response.text();
    let payload: unknown = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const errorMessage =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as Record<string, unknown>).error)
          : "Gagal memproses permintaan";

      throw new Error(errorMessage);
    }

    return (payload ?? undefined) as T;
  }

  export default function MasterData() {
    const [activeTab, setActiveTab] = useState<MasterTab>("Eselon 1");
    const [masterData, setMasterData] = useState<Record<MasterTab, MasterDataItem[]>>(
      initialMasterData,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const activeData = masterData[activeTab];
    const isEditMode = editingItemId !== null;

    const loadTabData = useCallback(async (tab: MasterTab) => {
      try {
        const data = await apiRequest<unknown>(endpointByTab(tab), { method: "GET" });
        setMasterData((prev) => ({
          ...prev,
          [tab]: normalizeMasterData(data),
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat data master.";
        setErrorMessage(message);
      }
    }, []);

    const loadAllData = useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      await Promise.allSettled(
        tabs.map(async (tab) => {
          await loadTabData(tab);
        }),
      );

      setIsLoading(false);
    }, [loadTabData]);

    useEffect(() => {
      void loadAllData();
    }, [loadAllData]);

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

    const handleDelete = async (item: MasterDataItem) => {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
        return;
      }

      try {
        await apiRequest<void>(`${endpointByTab(activeTab)}/${item.id}`, {
          method: "DELETE",
        });

        setMasterData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((entry) => entry.id !== item.id),
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal menghapus data.";
        setErrorMessage(message);
      }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedName = newName.trim();
      if (!trimmedName) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        if (activeTab === "Unit Kerja") {
          const eselonOptions = masterData["Eselon 1"];
          const defaultEselonId = eselonOptions[0]?.id ?? "";
          const currentItem = masterData["Unit Kerja"].find((item) => item.id === editingItemId);

          const payload = isEditMode && editingItemId
            ? {
                kode:
                  currentItem?.kode ?? buildUnitKerjaCode(trimmedName),
                nama: trimmedName,
                eselon1Id: currentItem?.eselon1Id ?? defaultEselonId,
              }
            : {
                kode: buildUnitKerjaCode(trimmedName),
                nama: trimmedName,
                eselon1Id: defaultEselonId,
              };

          if (!payload.eselon1Id) {
            throw new Error(
              "Tambahkan data Eselon 1 terlebih dahulu sebelum menambah Unit Kerja.",
            );
          }

          const endpoint = isEditMode && editingItemId
            ? `${endpointByTab(activeTab)}/${editingItemId}`
            : endpointByTab(activeTab);

          const saved = await apiRequest<MasterDataItem>(endpoint, {
            method: isEditMode ? "PUT" : "POST",
            body: JSON.stringify(payload),
          });

          const persisted = {
            ...saved,
            nama: saved.nama || trimmedName,
            id: saved.id || editingItemId || Date.now().toString(),
            kode: saved.kode || payload.kode,
            eselon1Id: saved.eselon1Id || payload.eselon1Id,
          };

          setMasterData((prev) => {
            if (isEditMode && editingItemId) {
              return {
                ...prev,
                [activeTab]: prev[activeTab].map((item) =>
                  item.id === editingItemId ? persisted : item,
                ),
              };
            }

            return {
              ...prev,
              [activeTab]: [persisted, ...prev[activeTab]],
            };
          });
        } else {
          const payload = { nama: trimmedName };
          const endpoint = isEditMode && editingItemId
            ? `${endpointByTab(activeTab)}/${editingItemId}`
            : endpointByTab(activeTab);

          const saved = await apiRequest<MasterDataItem>(endpoint, {
            method: isEditMode ? "PUT" : "POST",
            body: JSON.stringify(payload),
          });

          const persisted = {
            ...saved,
            id: saved.id || editingItemId || Date.now().toString(),
            nama: saved.nama || trimmedName,
          };

          setMasterData((prev) => {
            if (isEditMode && editingItemId) {
              return {
                ...prev,
                [activeTab]: prev[activeTab].map((item) =>
                  item.id === editingItemId ? persisted : item,
                ),
              };
            }

            return {
              ...prev,
              [activeTab]: [persisted, ...prev[activeTab]],
            };
          });
        }

        handleCloseModal();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal menyimpan data.";
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }
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

          {errorMessage ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

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
                  {isLoading && activeData.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-6 py-8 text-center text-sm text-gray-500">
                        Memuat data...
                      </TableCell>
                      <TableCell className="px-6 py-8">{" "}</TableCell>
                    </TableRow>
                  ) : activeData.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-6 py-8 text-center text-sm text-gray-500">
                        Belum ada data untuk {activeTab}.
                      </TableCell>
                      <TableCell className="px-6 py-8">{" "}</TableCell>
                    </TableRow>
                  ) : (
                    activeData.map((item) => (
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
                              onClick={() => handleDelete(item)}
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
                    ))
                  )}
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
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#1A3A5E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#112740] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan"}
                </button>
              </div>
            </Form>
          </div>
        </Modal>
      </>
    );
  }

import api from "../../../lib/api";
import Form from "../../form/Form";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Modal } from "../../ui/modal";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

import { useEffect, useState } from "react";

interface UnitKerja {
    id: string | number;
    nama?: string;
    name?: string;
}

const normalizeUnitKerjaList = (payload: unknown): UnitKerja[] => {
    if (!Array.isArray(payload)) return [];

    return payload.filter(
        (unit): unit is UnitKerja =>
            Boolean(unit) &&
            typeof unit === "object" &&
            "id" in unit &&
            (typeof (unit as UnitKerja).nama === "string" ||
                typeof (unit as UnitKerja).name === "string"),
    );
};

const getAgentUnitId = (agent: Record<string, unknown>) => {
    const unit = agent.unitKerja || agent.unit;
    const nestedUnitId =
        unit && typeof unit === "object" && "id" in unit ? unit.id : "";

    return String(
        agent.unitId ??
        agent.unit_id ??
        nestedUnitId ??
        "",
    );
};

const isAgentActive = (agent: Record<string, unknown> | any) => {
    const activeValue = agent?.active;
    return activeValue === true || activeValue === 1 || String(activeValue).trim() === "1";
};

export default function AgentTable() {
    const [agents, setAgents] = useState<any[]>([]);
    const [unitKerjaList, setUnitKerjaList] = useState<UnitKerja[]>([]);
    const [error, setError] = useState("");

    // Hitung jumlah agent aktif untuk header
    const activeCount = agents.filter((agent) => isAgentActive(agent)).length;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("AGENT");
    const [unitId, setUnitId] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const isEditMode = editingItemId !== null;

    const loadAgents = () => {
        api.get("/api/admin/agents").then((r) => setAgents(r.data)).catch((e) => setError(e.response?.data?.error || "Gagal memuat data petugas"));
    };

    useEffect(() => {
        loadAgents();
        api.get("/api/admin/unit-kerja")
            .then((r) => setUnitKerjaList(normalizeUnitKerjaList(r.data)))
            .catch((e) => setError(e.response?.data?.error || "Gagal memuat data unit kerja"));
    }, []);

    const resetForm = () => { setName(""); setEmail(""); setPassword(""); setRole("AGENT"); setUnitId(""); setEditingItemId(null); setIsModalOpen(false); };

    const handleOpenAddModal = () => {
        setEditingItemId(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("AGENT");
        setUnitId("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        setEditingItemId(item.id);
        setName(item.name);
        setEmail(item.email);
        setRole(item.role);
        setUnitId(getAgentUnitId(item));
        setPassword("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("AGENT");
        setUnitId("");
    };

    const handleToggle = async (id: string) => {
        try {
            await api.patch(`/api/admin/agents/${id}/toggle`);
            loadAgents();
        } catch (e: any) {
            setError(e.response?.data?.error || "Gagal memperbarui status.");
        }
    };

    const handleSave = async () => {
        try {
            const body: any = { name, email, role, unitId: unitId || null };
            if (password) body.password = password;

            if (editingItemId) {
                await api.put(`/api/admin/agents/${editingItemId}`, body);
            } else {
                if (!password) { setError("Kata sandi wajib diisi untuk akun petugas baru."); return; }
                await api.post("/api/admin/agents", body);
            }
            resetForm();
            loadAgents();
        } catch (e: any) {
            setError(e.response?.data?.error || "Gagal menyimpan akun.");
        }
    };

    return (
        <>
            <div className="p-2 sm:p-6 w-full">
                {/* Card Kontainer Utama */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

                    {/* Card Header & Tombol Tambah */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-medium text-gray-700">
                            Daftar Agent ({activeCount} aktif)
                        </h2>
                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-1.5 rounded-lg bg-[#1A3A5E] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#112740]"
                        >
                            <span className="text-lg leading-none">+</span>
                            Tambah
                        </button>
                    </div>

                    {/* Tabel Data */}
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#f8fafc] border-b border-gray-100">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Nama Agent
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Email
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Role
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Tiket Ditangani
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 font-semibold text-gray-500 text-start text-xs">
                                        Aksi
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100">
                                {agents.map((agent) => {
                                    const isActive = isAgentActive(agent);
                                    const isInactive = !isActive;
                                    const textClass = isInactive ? "text-gray-400" : "text-gray-700";

                                    return (
                                        <TableRow key={agent.id} className="hover:bg-gray-50/50">

                                            {/* Nama & Avatar Inisial */}
                                            <TableCell className="px-6 py-4 text-sm text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-blue text-xs font-medium ${agent.avatarColor}`}>
                                                        {agent.name.charAt(0)}
                                                    </div>
                                                    <span className={`font-medium ${textClass}`}>
                                                        {agent.name}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Email */}
                                            <TableCell className={`px-6 py-4 text-sm text-start ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {agent.email}
                                            </TableCell>

                                            {/* Role Badge */}
                                            <TableCell className="px-6 py-4 text-start">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${isInactive ? 'bg-gray-50 text-gray-400' : 'bg-[#e2e8f0]/60 text-gray-600'}`}>
                                                    {agent.role}
                                                </span>
                                            </TableCell>

                                            {/* Tiket Ditangani Badge */}
                                            <TableCell className="px-6 py-4 text-start">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${isInactive ? 'bg-gray-50 text-gray-400' : 'bg-[#ccfbf1]/60 text-[#0f766e]'}`}>
                                                    {agent.tickets} tiket
                                                </span>
                                            </TableCell>

                                            {/* Status Badge */}
                                            <TableCell className="px-6 py-4 text-start">
                                                <span                                                 className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${isActive
                                                    ? "bg-[#dcfce7]/60 text-[#166534]"
                                                    : "bg-gray-100 text-gray-400"
                                                    }`}>
                                                    {isActive ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </TableCell>

                                            {/* Aksi (Edit, Aktifkan/Nonaktifkan) */}
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-start gap-2">
                                                    {/* Tombol Edit */}
                                                    <button
                                                        className="inline-flex items-center gap-1.5 rounded-md bg-[#e0f2fe]/60 px-3 py-1.5 text-xs font-medium text-[#0284c7] transition-colors hover:bg-[#e0f2fe]"
                                                        onClick={() => handleOpenEditModal(agent)}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>

                                                    {/* Tombol Toggle Status (Aktifkan / Nonaktifkan) */}
                                                    <button
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isActive
                                                            ? "bg-[#fef3c7]/60 text-[#b45309] hover:bg-[#fef3c7]"
                                                            : "bg-green-50 text-green-500 hover:bg-green-200"
                                                            }`}
                                                        onClick={() => handleToggle(agent.id)}
                                                    >
                                                        {isActive ? (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Nonaktifkan
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Aktifkan
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                            {isEditMode ? "Edit Data Agent" : "Tambah Akun Agent"}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-gray-900"></h3>
                    </div>

                    <Form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <Label htmlFor="nama_agent" className="text-gray-700">
                                Nama
                            </Label>
                            <Input
                                id="nama_agent"
                                name="nama"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Masukkan nama"
                                className="bg-white"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email_kkp" className="text-gray-700">
                                Email KKP
                            </Label>
                            <Input
                                id="email_kkp"
                                name="email_kkp"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Masukkan email kkp"
                                className="bg-white"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-gray-700">
                                Kata Sandi
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah kata sandi" : "Masukkan kata sandi"}
                                className="bg-white"
                                required={!isEditMode} // Wajib diisi saat menambah akun baru, tapi tidak wajib saat edit
                            />
                        </div>
                        <div>
                            <Label htmlFor="role" className="text-gray-700">
                                Role
                            </Label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1A3A5E] focus:ring focus:ring-[#1A3A5E]/50"
                                required
                            >
                                <option value="AGENT">Agent</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="unit_kerja" className="text-gray-700">
                                Unit Kerja
                            </Label>
                            <select
                                id="unit_kerja"
                                name="unit_kerja"
                                value={unitId}
                                onChange={(event) => setUnitId(event.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1A3A5E] focus:ring focus:ring-[#1A3A5E]/50"
                                required
                            >
                                <option value="">Pilih Unit Kerja</option>
                                {unitKerjaList.map((unit) => (
                                    <option key={String(unit.id)} value={String(unit.id)}>
                                        {unit.nama || unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="text-sm text-center text-error-500">{error}</div>
                        )}

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
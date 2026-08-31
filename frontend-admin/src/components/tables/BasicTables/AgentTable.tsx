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

import { useState } from "react";

// 1. Interface untuk data Agent
interface Agent {
    id: number;
    name: string;
    email: string;
    role: string;
    tickets: number;
    status: "Aktif" | "Nonaktif";
    avatarColor: string;
}

// 2. Dummy Data (Berdasarkan referensi gambar)
const agentData: Agent[] = [
    {
        id: 1,
        name: "Budi Santoso",
        email: "budi.s@kkp.go.id",
        role: "Admin",
        tickets: 24,
        status: "Aktif",
        avatarColor: "bg-[#1e3a5f]", // Dark blue
    },
    {
        id: 2,
        name: "Siti Rahayu",
        email: "siti.r@kkp.go.id",
        role: "Agent",
        tickets: 18,
        status: "Aktif",
        avatarColor: "bg-[#0d7b8a]", // Teal
    },
    {
        id: 3,
        name: "Hendra Wijaya",
        email: "hendra.w@kkp.go.id",
        role: "Agent",
        tickets: 11,
        status: "Aktif",
        avatarColor: "bg-[#0d7b8a]", // Teal
    },
    {
        id: 4,
        name: "Yuliani Pratiwi",
        email: "yuliani.p@kkp.go.id",
        role: "Agent",
        tickets: 7,
        status: "Nonaktif",
        avatarColor: "bg-[#94a3b8]", // Gray (karena nonaktif)
    },
    {
        id: 5,
        name: "Eko Prasetyo",
        email: "eko.p@kkp.go.id",
        role: "Agent",
        tickets: 15,
        status: "Aktif",
        avatarColor: "bg-[#0d7b8a]", // Teal
    },
];


export default function AgentTable() {
    // Hitung jumlah agent aktif untuk header
    const activeCount = agentData.filter((a) => a.status === "Aktif").length;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [editingItemId, setEditingItemId] = useState<number | null>(null);

    const isEditMode = editingItemId !== null;

    const handleOpenAddModal = () => {
        setEditingItemId(null);
        setNewName("");
        setNewEmail("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: Agent) => {
        setEditingItemId(item.id);
        setNewName(item.name);
        setNewEmail(item.email)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setNewName("");
        setNewEmail("");
    };

    const handleSubmit = () => {

    }
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
                                {agentData.map((agent) => {
                                    // Menentukan class teks jika status Nonaktif (teks menjadi abu-abu pudar)
                                    const isInactive = agent.status === "Nonaktif";
                                    const textClass = isInactive ? "text-gray-400" : "text-gray-700";

                                    return (
                                        <TableRow key={agent.id} className="hover:bg-gray-50/50">

                                            {/* Nama & Avatar Inisial */}
                                            <TableCell className="px-6 py-4 text-sm text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-medium ${agent.avatarColor}`}>
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
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${agent.status === "Aktif"
                                                    ? "bg-[#dcfce7]/60 text-[#166534]"
                                                    : "bg-gray-100 text-gray-400"
                                                    }`}>
                                                    {agent.status}
                                                </span>
                                            </TableCell>

                                            {/* Aksi (Edit, Aktifkan/Nonaktifkan) */}
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-start gap-2">
                                                    {/* Tombol Edit */}
                                                    <button
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isInactive ? 'bg-gray-50 text-gray-400' : 'bg-[#e0f2fe]/60 text-[#0284c7] hover:bg-[#e0f2fe]'}`}
                                                        onClick={() => handleOpenEditModal(agent)}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>

                                                    {/* Tombol Toggle Status (Aktifkan / Nonaktifkan) */}
                                                    {agent.status === "Aktif" ? (
                                                        <button className="px-3 py-1.5 bg-[#ffedd5]/60 text-[#c2410c] hover:bg-[#ffedd5] rounded-md text-xs font-medium transition-colors">
                                                            Nonaktifkan
                                                        </button>
                                                    ) : (
                                                        <button className="px-3 py-1.5 bg-[#dcfce7]/60 text-[#166534] hover:bg-[#dcfce7] rounded-md text-xs font-medium transition-colors">
                                                            Aktifkan
                                                        </button>
                                                    )}
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

                    <Form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="nama_agent" className="text-gray-700">
                                Nama
                            </Label>
                            <Input
                                id="nama_agent"
                                name="nama"
                                value={newName}
                                onChange={(event) => setNewName(event.target.value)}
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
                                value={newEmail}
                                onChange={(event) => setNewEmail(event.target.value)}
                                placeholder="Masukkan email kkp"
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
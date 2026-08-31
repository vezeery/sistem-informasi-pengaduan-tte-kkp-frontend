import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";

// 1. Sesuaikan Interface dengan data tiket
interface Ticket {
  id: number;
  noTiket: string;
  pelapor: {
    image: string;
    name: string;
    email: string;
  };
  kategori: string;
  status: "Proses" | "Selesai";
  agent: string;
  tanggal: string;
}

// 2. Ubah data dummy sesuai dengan format tiket
const tableData: Ticket[] = [
  {
    id: 1,
    noTiket: "#TKT-1001",
    pelapor: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      email: "lindsey@kkp.go.id",
    },
    kategori: "Akses Sistem",
    status: "Proses",
    agent: "Budi Santoso",
    tanggal: "27 Agu 2026",
  },
  {
    id: 2,
    noTiket: "#TKT-1002",
    pelapor: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      email: "kaiya@kkp.go.id",
    },
    kategori: "Error Data",
    status: "Selesai",
    agent: "Siti Aminah",
    tanggal: "26 Agu 2026",
  },
  {
    id: 3,
    noTiket: "#TKT-1003",
    pelapor: {
      image: "/images/user/user-20.jpg",
      name: "Zain Geidt",
      email: "zain@kkp.go.id",
    },
    kategori: "Kegagalan Proses",
    status: "Proses",
    agent: "Budi Santoso",
    tanggal: "26 Agu 2026",
  },
  {
    id: 4,
    noTiket: "#TKT-1004",
    pelapor: {
      image: "/images/user/user-21.jpg",
      name: "Abram Schleifer",
      email: "abram@kkp.go.id",
    },
    kategori: "Akses Sistem",
    status: "Selesai",
    agent: "Siti Aminah",
    tanggal: "25 Agu 2026",
  },
];

export default function TicketTable() {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-[#F0F6F8]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                No Tiket
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pelapor
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kategori
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Agent
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tanggal
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((ticket) => (
              <TableRow key={ticket.id}>
                {/* Kolom No Tiket */}
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 font-medium dark:text-white/90">
                  {ticket.noTiket}
                </TableCell>

                {/* Kolom Pelapor (Foto + Nama + Email) */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={ticket.pelapor.image}
                        alt={ticket.pelapor.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {ticket.pelapor.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {ticket.pelapor.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Kolom Kategori */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {ticket.kategori}
                </TableCell>

                {/* Kolom Status (Badge dengan 2 kondisi) */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={ticket.status === "Selesai" ? "success" : "warning"}
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>

                {/* Kolom Agent */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {ticket.agent}
                </TableCell>

                {/* Kolom Tanggal */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {ticket.tanggal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
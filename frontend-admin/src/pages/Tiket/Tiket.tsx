import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TiketTable from "../../components/tables/BasicTables/TiketTable";

export default function Tiket() {
  return (
    <>
      <PageMeta
        title="Daftar Tiket | Admin Helpdesk KKP"
        description="Daftar seluruh tiket pengaduan TTE Kementerian Kelautan dan Perikanan"
      />
      <PageBreadcrumb pageTitle="Semua Tiket" />
      <div className="space-y-6">
        <ComponentCard title="Semua Tiket">
          <TiketTable />
        </ComponentCard>
      </div>
    </>
  );
}

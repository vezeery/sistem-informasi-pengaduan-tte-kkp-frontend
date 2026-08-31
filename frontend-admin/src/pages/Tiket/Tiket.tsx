import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TiketTable from "../../components/tables/BasicTables/TiketTable";

export default function Tiket() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Tiket" />
      <div className="space-y-6">
        <ComponentCard title="Semua Tiket">
          <TiketTable />
        </ComponentCard>
      </div>
    </>
  );
}

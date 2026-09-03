import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import MasterDataTable from "../../components/tables/BasicTables/MasterDataTable";

export default function Tiket() {
  return (
    <>
      <PageMeta
        title="Master Data | Admin Helpdesk KKP"
        description="Halaman master data admin helpdesk Kementerian Kelautan dan Perikanan"
      />
      <PageBreadcrumb pageTitle="Master Data" />
      <div className="space-y-6">
          <MasterDataTable />
      </div>
    </>
  );
}

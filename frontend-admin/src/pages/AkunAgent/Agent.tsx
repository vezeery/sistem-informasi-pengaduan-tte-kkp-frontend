import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AgentTable from "../../components/tables/BasicTables/AgentTable";

export default function AkunAgent() {
  return (
    <>
      <PageMeta
        title="Akun Agent"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Agent" />
      <div className="space-y-6">
        <ComponentCard title="Akun Agent">
          <AgentTable />
        </ComponentCard>
      </div>
    </>
  );
}

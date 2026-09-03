import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RecentOrders from "../../components/dashboard/RecentTickets";
import StatisticsChart from "../../components/dashboard/StatisticsChart";
import TiketMetrics from "../../components/dashboard/TiketMetrics";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Admin Helpdesk KKP"
        description="Halaman utama dashboard admin helpdesk Kementerian Kelautan dan Perikanan"
      />
      <div className="grid grid-cols-6 gap-4 md:gap-4">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <TiketMetrics />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <div className="space-y-6">
            <ComponentCard title="Tiket Terbaru">
              <RecentOrders />
            </ComponentCard>
          </div>
        </div>
      </div>
    </>
  );
}

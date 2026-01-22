import { Dashboard } from "@/components/Dashboard";

export function DashboardPage() {
  return (
    <div className="container mx-auto p-6 h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
    </div>
  );
}
export default DashboardPage;

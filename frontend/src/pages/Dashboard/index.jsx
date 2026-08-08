import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  Brain,
  AlertTriangle,
} from "lucide-react";

import PageLayout from "../../components/layout/PageLayout";
import StatCard from "../../components/dashboard/StatCard";

import { getDashboardStats } from "../../services/dashboardService";

function Dashboard() {

  const [stats, setStats] = useState({
    total_patients: 0,
    total_medical_records: 0,
    total_ai_analyses: 0,
    high_risk_cases: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadDashboard() {

      try {

        const data = await getDashboardStats();

        setStats(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadDashboard();

  }, []);

  return (
    <PageLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back 👋
        </p>

      </div>

      {
        loading ? (

          <div className="text-xl">
            Loading Dashboard...
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatCard
              title="Patients"
              value={stats.total_patients}
              icon={<Users size={28} />}
              color="bg-blue-600"
            />

            <StatCard
              title="Medical Records"
              value={stats.total_medical_records}
              icon={<FileText size={28} />}
              color="bg-green-600"
            />

            <StatCard
              title="AI Analyses"
              value={stats.total_ai_analyses}
              icon={<Brain size={28} />}
              color="bg-purple-600"
            />

            <StatCard
              title="High Risk Cases"
              value={stats.high_risk_cases}
              icon={<AlertTriangle size={28} />}
              color="bg-red-600"
            />

          </div>

        )
      }

    </PageLayout>
  );
}

export default Dashboard;
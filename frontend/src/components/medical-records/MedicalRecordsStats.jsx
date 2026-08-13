import {
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  CalendarCheck,
} from "lucide-react";

import StatCard from "../common/StatCard";

function MedicalRecordsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <StatCard
        title="Total Records"
        value={stats.total}
        icon={<ClipboardList size={28} />}
        color="bg-blue-600"
      />

      <StatCard
        title="Today's Visits"
        value={stats.todayVisits}
        icon={<CalendarDays size={28} />}
        color="bg-green-600"
      />

      <StatCard
        title="High Risk"
        value={stats.highRisk}
        icon={<AlertTriangle size={28} />}
        color="bg-red-600"
      />

      <StatCard
        title="Follow-ups"
        value={stats.followUps}
        icon={<CalendarCheck size={28} />}
        color="bg-orange-500"
      />
    </div>
  );
}

export default MedicalRecordsStats;
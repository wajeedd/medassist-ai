import {
  Users,
  Mars,
  Venus,
  Droplets,
} from "lucide-react";

import StatCard from "../../components/common/StatCard";

function PatientsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      <StatCard
        title="Total Patients"
        value={stats.total}
        icon={<Users size={28} />}
      />

      <StatCard
        title="Male"
        value={stats.males}
        icon={<Mars size={28} />}
        color="bg-blue-600"
      />

      <StatCard
        title="Female"
        value={stats.females}
        icon={<Venus size={28} />}
        color="bg-pink-600"
      />

      <StatCard
        title="Most Common Blood Group"
        value={stats.blood}
        icon={<Droplets size={28} />}
        color="bg-red-600"
      />

    </div>
  );
}

export default PatientsStats;
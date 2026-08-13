import { Search } from "lucide-react";

function MedicalRecordsToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="relative max-w-xl">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medical records..."
          className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default MedicalRecordsToolbar;
import { Search } from "lucide-react";

function PatientSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative w-full md:w-96">

      <Search
        className="absolute left-3 top-3 text-gray-400"
        size={20}
      />

      <input
        type="text"
        placeholder="Search patients..."
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

    </div>
  );
}

export default PatientSearch;
import PatientSearch from "../../components/patients/PatientSearch";

function PatientsToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="mb-6">
      <PatientSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default PatientsToolbar;
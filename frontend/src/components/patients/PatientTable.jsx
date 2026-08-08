import PatientRow from "./PatientRow";

function PatientTable({
  patients,
  onView,
}) {

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No patients found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Patient
            </th>

            <th className="px-6 py-4 text-left">
              Gender
            </th>

            <th className="px-6 py-4 text-left">
              Phone
            </th>

            <th className="px-6 py-4 text-left">
              Email
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {patients.map((patient) => (

            <PatientRow
              key={patient.id}
              patient={patient}
              onView={onView}
            />

          ))}

        </tbody>

      </table>

    </div>
  );

}

export default PatientTable;
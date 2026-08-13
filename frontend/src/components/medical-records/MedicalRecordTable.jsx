import MedicalRecordRow from "./MedicalRecordRow";

function MedicalRecordTable({
  records,
  onView,
  onEdit,
  onDelete,
}) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No medical records found
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
              Visit
            </th>

            <th className="px-6 py-4 text-left">
              Diagnosis
            </th>

            <th className="px-6 py-4 text-left">
              Date
            </th>

            <th className="px-6 py-4 text-center">
              Risk
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <MedicalRecordRow
              key={record.id}
              record={record}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicalRecordTable;
import { useEffect, useState } from "react";
import { getMyMedicalRecords, getMyProfile } from "../../services/patientPortalService";

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileData, recordsData] = await Promise.all([
          getMyProfile(),
          getMyMedicalRecords(),
        ]);

        setProfile(profileData);
        setRecords(recordsData);
      } catch (err) {
        console.error("Failed to load patient dashboard:", err);
        setError(
          err?.response?.data?.detail ||
            "Unable to load your medical information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading your medical information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {profile?.first_name} {profile?.last_name}
        </h1>

        <p className="mt-1 text-gray-500">
          Here's an overview of your medical information.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Medical Visits</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {records.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Date of Birth</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {profile?.date_of_birth || "Not available"}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Gender</p>
          <p className="mt-2 text-lg font-semibold capitalize text-gray-900">
            {profile?.gender || "Not available"}
          </p>
        </div>
      </div>

      {/* Medical records */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Medical Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recent medical history.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">
            No medical records available.
          </div>
        ) : (
          <div className="divide-y">
            {records.map((record) => (
              <div
                key={record.id}
                className="px-6 py-5 transition hover:bg-gray-50"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {record.chief_complaint || "Medical consultation"}
                      </h3>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                        {record.visit_type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {record.visit_date}
                    </p>

                    {record.diagnosis && (
                      <p className="mt-3 text-sm text-gray-700">
                        <span className="font-medium">Diagnosis:</span>{" "}
                        {record.diagnosis}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Follow-up:{" "}
                    <span className="font-medium text-gray-700">
                      {record.follow_up_date || "Not scheduled"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
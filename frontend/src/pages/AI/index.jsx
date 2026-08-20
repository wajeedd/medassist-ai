import { useEffect, useState } from "react";

import {
  Brain,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  FlaskConical,
  RefreshCw,
  User,
} from "lucide-react";

import PageLayout from "../../components/layout/PageLayout";

import { getPatients } from "../../services/patientService";

import {
  getPatientMedicalRecords,
  getPatientLongitudinalAnalysis,
} from "../../services/medicalRecordService";


function AI() {

  // =====================================================
  // STATE
  // =====================================================

  const [patients, setPatients] = useState([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [records, setRecords] = useState([]);

  const [selectedRecordId, setSelectedRecordId] =
    useState("");

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [longitudinalAnalysis, setLongitudinalAnalysis] =
    useState(null);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingRecords, setLoadingRecords] =
    useState(false);

  const [loadingLongitudinal, setLoadingLongitudinal] =
    useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  useEffect(() => {

    const loadPatients = async () => {

      try {

        setLoadingPatients(true);
        setError("");

        const data = await getPatients();

        setPatients(data || []);

      } catch (err) {

        console.error(err);

        setError("Failed to load patients.");

      } finally {

        setLoadingPatients(false);

      }

    };

    loadPatients();

  }, []);


  // =====================================================
  // LOAD PATIENT MEDICAL RECORDS
  // =====================================================

  useEffect(() => {

    if (!selectedPatientId) {

      setRecords([]);
      setSelectedRecord(null);
      setSelectedRecordId("");
      setLongitudinalAnalysis(null);

      return;

    }


    const loadRecords = async () => {

      try {

        setLoadingRecords(true);
        setError("");

        const data =
          await getPatientMedicalRecords(
            selectedPatientId
          );

        setRecords(data || []);

        if (data && data.length > 0) {

          setSelectedRecordId(data[0].id);

          setSelectedRecord(data[0]);

        } else {

          setSelectedRecordId("");
          setSelectedRecord(null);

        }

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load medical records."
        );

        setRecords([]);

      } finally {

        setLoadingRecords(false);

      }

    };

    loadRecords();

  }, [selectedPatientId]);


  // =====================================================
  // SELECT MEDICAL RECORD
  // =====================================================

  useEffect(() => {

    if (!selectedRecordId) {

      setSelectedRecord(null);

      return;

    }

    const record = records.find(
      (item) => item.id === selectedRecordId
    );

    setSelectedRecord(record || null);

  }, [selectedRecordId, records]);


  // =====================================================
  // GENERATE LONGITUDINAL ANALYSIS
  // =====================================================

  const handleLongitudinalAnalysis = async () => {

    if (!selectedPatientId) {

      setError(
        "Please select a patient first."
      );

      return;

    }

    try {

      setLoadingLongitudinal(true);
      setError("");

      const data =
        await getPatientLongitudinalAnalysis(
          selectedPatientId
        );

      setLongitudinalAnalysis(data);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to generate longitudinal AI analysis."
      );

    } finally {

      setLoadingLongitudinal(false);

    }

  };


  // =====================================================
  // RISK HELPERS
  // =====================================================

  const getRiskColor = (score) => {

    if (score === null || score === undefined) {
      return "bg-gray-100 text-gray-600";
    }

    if (score >= 70) {
      return "bg-red-100 text-red-700";
    }

    if (score >= 40) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";

  };


  const getRiskLabel = (score) => {

    if (score === null || score === undefined) {
      return "Insufficient Data";
    }

    if (score >= 70) {
      return "High";
    }

    if (score >= 40) {
      return "Moderate";
    }

    return "Low";

  };


  // =====================================================
  // SELECTED PATIENT
  // =====================================================

  const selectedPatient = patients.find(
    (patient) =>
      patient.id === selectedPatientId
  );


  // =====================================================
  // UI
  // =====================================================

  return (

    <PageLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

            <Brain
              size={30}
              className="text-purple-600"
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-slate-800">

              AI Analysis

            </h1>

            <p className="text-gray-500 mt-1">

              AI-powered clinical decision support
              and patient analysis.

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

          {error}

        </div>

      )}


      {/* =================================================
          PATIENT SELECTION
      ================================================= */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-8">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <User
              size={21}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Select Patient

            </h2>

            <p className="text-sm text-gray-500">

              Select a patient to view AI-powered
              clinical insights.

            </p>

          </div>

        </div>


        <select
          value={selectedPatientId}
          onChange={(e) =>
            setSelectedPatientId(e.target.value)
          }
          disabled={loadingPatients}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

          <option value="">

            {loadingPatients
              ? "Loading patients..."
              : "Select a patient"}

          </option>

          {patients.map((patient) => (

            <option
              key={patient.id}
              value={patient.id}
            >

              {patient.first_name}{" "}
              {patient.last_name}

            </option>

          ))}

        </select>


        {selectedPatient && (

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">

            <p className="font-semibold text-blue-900">

              Selected Patient:{" "}

              {selectedPatient.first_name}{" "}
              {selectedPatient.last_name}

            </p>

          </div>

        )}

      </div>


      {/* =================================================
          MEDICAL RECORD SELECTION
      ================================================= */}

      {selectedPatientId && (

        <div className="bg-white rounded-2xl shadow border p-6 mb-8">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

              <FileText
                size={21}
                className="text-purple-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">

                Medical Record Analysis

              </h2>

              <p className="text-sm text-gray-500">

                Select a medical record to review
                its AI-generated analysis.

              </p>

            </div>

          </div>


          {loadingRecords ? (

            <div className="py-6 text-center text-gray-500">

              Loading medical records...

            </div>

          ) : records.length === 0 ? (

            <div className="py-6 text-center text-gray-500">

              No medical records found for this patient.

            </div>

          ) : (

            <>

              <select
                value={selectedRecordId}
                onChange={(e) =>
                  setSelectedRecordId(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >

                {records.map((record, index) => (

                  <option
                    key={record.id}
                    value={record.id}
                  >

                    Record {index + 1}

                    {record.visit_date
                      ? ` - ${record.visit_date}`
                      : ""}

                    {record.chief_complaint
                      ? ` - ${record.chief_complaint}`
                      : ""}

                  </option>

                ))}

              </select>


              {selectedRecord && (

                <div className="space-y-6">

                  {/* =================================
                      RISK SUMMARY
                  ================================= */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="p-5 rounded-xl bg-slate-50 border">

                      <p className="text-sm text-gray-500">

                        AI Risk Score

                      </p>

                      <p className="text-3xl font-bold text-slate-800 mt-2">

                        {selectedRecord.ai_risk_score ??
                          "N/A"}

                      </p>

                    </div>


                    <div className="p-5 rounded-xl bg-slate-50 border">

                      <p className="text-sm text-gray-500">

                        Risk Level

                      </p>

                      <div className="mt-2">

                        <span
                          className={`inline-block px-4 py-2 rounded-full font-semibold ${getRiskColor(
                            selectedRecord.ai_risk_score
                          )}`}
                        >

                          {getRiskLabel(
                            selectedRecord.ai_risk_score
                          )}

                        </span>

                      </div>

                    </div>


                    <div className="p-5 rounded-xl bg-slate-50 border">

                      <p className="text-sm text-gray-500">

                        Emergency

                      </p>

                      <div className="mt-2">

                        {selectedRecord.ai_emergency ? (

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">

                            <AlertTriangle size={17} />

                            Emergency

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">

                            <CheckCircle size={17} />

                            No Emergency

                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* =================================
                      AI SUMMARY
                  ================================= */}

                  <div className="p-6 rounded-xl border">

                    <div className="flex items-center gap-3 mb-4">

                      <Sparkles
                        size={22}
                        className="text-purple-600"
                      />

                      <h3 className="text-lg font-bold">

                        AI Summary

                      </h3>

                    </div>

                    <p className="text-gray-700 leading-7">

                      {selectedRecord.ai_summary ||
                        "AI summary is not available for this record."}

                    </p>

                  </div>


                  {/* =================================
                      POSSIBLE CONDITIONS
                  ================================= */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="p-6 rounded-xl border">

                      <div className="flex items-center gap-3 mb-4">

                        <Activity
                          size={21}
                          className="text-blue-600"
                        />

                        <h3 className="text-lg font-bold">

                          Possible Conditions

                        </h3>

                      </div>

                      <p className="text-gray-500">

                        Detailed condition analysis is
                        available through the generated
                        AI assessment.

                      </p>

                    </div>


                    <div className="p-6 rounded-xl border">

                      <div className="flex items-center gap-3 mb-4">

                        <FlaskConical
                          size={21}
                          className="text-purple-600"
                        />

                        <h3 className="text-lg font-bold">

                          Recommended Tests

                        </h3>

                      </div>

                      <p className="text-gray-500">

                        Review recommended clinical
                        tests from the AI assessment.

                      </p>

                    </div>

                  </div>


                  {/* =================================
                      RECOMMENDATIONS
                  ================================= */}

                  <div className="p-6 rounded-xl border">

                    <div className="flex items-center gap-3 mb-4">

                      <ShieldCheck
                        size={22}
                        className="text-green-600"
                      />

                      <h3 className="text-lg font-bold">

                        AI Recommendations

                      </h3>

                    </div>

                    {selectedRecord.ai_recommendation ? (

                      <div className="space-y-2">

                        {selectedRecord.ai_recommendation
                          .split("\n")
                          .filter(Boolean)
                          .map((recommendation, index) => (

                            <div
                              key={index}
                              className="flex items-start gap-3"
                            >

                              <CheckCircle
                                size={18}
                                className="text-green-600 mt-1 shrink-0"
                              />

                              <p className="text-gray-700">

                                {recommendation}

                              </p>

                            </div>

                          ))}

                      </div>

                    ) : (

                      <p className="text-gray-500">

                        No AI recommendations are
                        available for this record.

                      </p>

                    )}

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      )}


      {/* =================================================
          LONGITUDINAL ANALYSIS
      ================================================= */}

      {selectedPatientId && (

        <div className="bg-white rounded-2xl shadow border p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                <Activity
                  size={25}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-800">

                  Longitudinal AI Insights

                </h2>

                <p className="text-sm text-gray-500">

                  Analyze the patient's complete
                  clinical history.

                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={handleLongitudinalAnalysis}
              disabled={loadingLongitudinal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
            >

              <RefreshCw
                size={18}
                className={
                  loadingLongitudinal
                    ? "animate-spin"
                    : ""
                }
              />

              {loadingLongitudinal
                ? "Analyzing..."
                : "Generate Longitudinal Analysis"}

            </button>

          </div>


          {longitudinalAnalysis && (

            <div className="mt-8 space-y-6">

              {/* =================================
                  OVERVIEW
              ================================= */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">

                  <p className="text-sm text-gray-500">

                    Overall Health Trend

                  </p>

                  <p className="text-2xl font-bold text-blue-700 mt-2">

                    {longitudinalAnalysis.overall_health_trend}

                  </p>

                </div>


                <div className="p-5 rounded-xl bg-purple-50 border border-purple-100">

                  <p className="text-sm text-gray-500">

                    Overall Risk Level

                  </p>

                  <p className="text-2xl font-bold text-purple-700 mt-2">

                    {longitudinalAnalysis.overall_risk_level}

                  </p>

                </div>


                <div className="p-5 rounded-xl bg-green-50 border border-green-100">

                  <p className="text-sm text-gray-500">

                    Average Risk Score

                  </p>

                  <p className="text-2xl font-bold text-green-700 mt-2">

                    {longitudinalAnalysis.average_risk_score}

                  </p>

                </div>

              </div>


              {/* =================================
                  RISK EVOLUTION
              ================================= */}

              <div className="p-6 rounded-xl border">

                <h3 className="text-lg font-bold mb-3">

                  Risk Evolution

                </h3>

                <p className="text-gray-700 leading-7">

                  {longitudinalAnalysis.risk_evolution}

                </p>

              </div>


              {/* =================================
                  KEY OBSERVATIONS
              ================================= */}

              <div className="p-6 rounded-xl border">

                <h3 className="text-lg font-bold mb-4">

                  Key Observations

                </h3>

                <div className="space-y-3">

                  {(
                    longitudinalAnalysis.key_observations ||
                    []
                  ).map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <Activity
                        size={18}
                        className="text-blue-600 mt-1 shrink-0"
                      />

                      <p className="text-gray-700">

                        {item}

                      </p>

                    </div>

                  ))}

                </div>

              </div>


              {/* =================================
                  RECURRING CONDITIONS / COMPLAINTS
              ================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="p-6 rounded-xl border">

                  <h3 className="text-lg font-bold mb-4">

                    Recurring Conditions

                  </h3>

                  {(
                    longitudinalAnalysis.recurring_conditions ||
                    []
                  ).length > 0 ? (

                    <ul className="space-y-2">

                      {longitudinalAnalysis.recurring_conditions.map(
                        (item, index) => (

                          <li
                            key={index}
                            className="flex gap-2 text-gray-700"
                          >

                            <span>•</span>

                            {item}

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-gray-500">

                      No recurring conditions identified.

                    </p>

                  )}

                </div>


                <div className="p-6 rounded-xl border">

                  <h3 className="text-lg font-bold mb-4">

                    Recurring Complaints

                  </h3>

                  {(
                    longitudinalAnalysis.recurring_complaints ||
                    []
                  ).length > 0 ? (

                    <ul className="space-y-2">

                      {longitudinalAnalysis.recurring_complaints.map(
                        (item, index) => (

                          <li
                            key={index}
                            className="flex gap-2 text-gray-700"
                          >

                            <span>•</span>

                            {item}

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-gray-500">

                      No recurring complaints identified.

                    </p>

                  )}

                </div>

              </div>


              {/* =================================
                  IMPORTANT CHANGES
              ================================= */}

              <div className="p-6 rounded-xl border">

                <h3 className="text-lg font-bold mb-4">

                  Important Changes

                </h3>

                <div className="space-y-3">

                  {(
                    longitudinalAnalysis.important_changes ||
                    []
                  ).map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <AlertTriangle
                        size={18}
                        className="text-orange-500 mt-1 shrink-0"
                      />

                      <p className="text-gray-700">

                        {item}

                      </p>

                    </div>

                  ))}

                </div>

              </div>


              {/* =================================
                  FOLLOW-UP
              ================================= */}

              <div className="p-6 rounded-xl bg-green-50 border border-green-100">

                <h3 className="text-lg font-bold text-green-900 mb-4">

                  Follow-up Recommendations

                </h3>

                <div className="space-y-3">

                  {(
                    longitudinalAnalysis.follow_up_recommendations ||
                    []
                  ).map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle
                        size={18}
                        className="text-green-600 mt-1 shrink-0"
                      />

                      <p className="text-green-900">

                        {item}

                      </p>

                    </div>

                  ))}

                </div>

              </div>


              {/* =================================
                  SAFETY NOTICE
              ================================= */}

              <div className="p-5 rounded-xl bg-purple-50 border border-purple-100">

                <p className="text-sm text-purple-900">

                  <strong>
                    AI Insight Notice:
                  </strong>{" "}

                  These longitudinal insights are
                  generated by AI from the patient's
                  available clinical records. They are
                  intended to assist healthcare
                  professionals in reviewing patient
                  history and should not replace
                  professional medical judgment.

                </p>

              </div>

            </div>

          )}

        </div>

      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!selectedPatientId && (

        <div className="bg-white rounded-2xl shadow border p-10 text-center">

          <Brain
            size={50}
            className="mx-auto text-purple-400 mb-4"
          />

          <h2 className="text-xl font-bold text-slate-800">

            Select a patient to begin

          </h2>

          <p className="text-gray-500 mt-2">

            Choose a patient above to access
            AI-powered medical record analysis,
            risk assessment, and longitudinal insights.

          </p>

        </div>

      )}


      {/* =================================================
          GLOBAL AI NOTICE
      ================================================= */}

      <div className="mt-8 p-6 rounded-2xl bg-purple-50 border border-purple-100">

        <div className="flex items-start gap-4">

          <Brain
            size={24}
            className="text-purple-600 mt-1 shrink-0"
          />

          <div>

            <h3 className="font-bold text-purple-900">

              MedAssist AI Clinical Decision Support

            </h3>

            <p className="text-sm text-purple-800 mt-2">

              AI-generated insights are intended to
              assist healthcare professionals in
              reviewing patient information. They
              should not replace professional medical
              judgment or clinical diagnosis.

            </p>

          </div>

        </div>

      </div>

    </PageLayout>

  );

}

export default AI;
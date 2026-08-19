import { useEffect, useMemo, useState } from "react";

import {
  Users,
  FileText,
  Loader2,
  BarChart3,
  Activity,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Heart,
  Wind,
  CalendarDays,
  Brain,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PageLayout from "../../components/layout/PageLayout";

import { getPatients } from "../../services/patientService";

import {
  getPatientMedicalRecords,
  getPatientLongitudinalAnalysis,
} from "../../services/medicalRecordService";

function Reports() {

  const [patients, setPatients] = useState([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [medicalRecords, setMedicalRecords] =
    useState([]);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingRecords, setLoadingRecords] =
    useState(false);

  const [recordsError, setRecordsError] =
    useState("");

  // ======================================================
  // LONGITUDINAL AI STATE
  // ======================================================

  const [longitudinalAnalysis, setLongitudinalAnalysis] =
    useState(null);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [aiError, setAIError] =
    useState("");


  // ======================================================
  // LOAD PATIENTS
  // ======================================================

  useEffect(() => {

    const loadPatients = async () => {

      try {

        setLoadingPatients(true);

        const data = await getPatients();

        setPatients(data || []);

      } catch (error) {

        console.error(
          "Failed to load patients:",
          error
        );

      } finally {

        setLoadingPatients(false);

      }

    };

    loadPatients();

  }, []);


  // ======================================================
  // LOAD MEDICAL RECORDS
  // ======================================================

  useEffect(() => {

    if (!selectedPatientId) {

      setMedicalRecords([]);
      setLongitudinalAnalysis(null);
      setAIError("");

      return;

    }

    const loadMedicalRecords = async () => {

      try {

        setLoadingRecords(true);

        setRecordsError("");

        const data =
          await getPatientMedicalRecords(
            selectedPatientId
          );

        const sortedRecords =
          (data || []).sort(
            (a, b) =>
              new Date(a.visit_date) -
              new Date(b.visit_date)
          );

        setMedicalRecords(sortedRecords);

      } catch (error) {

        console.error(
          "Failed to load medical records:",
          error
        );

        setRecordsError(
          "Failed to load medical records."
        );

        setMedicalRecords([]);

      } finally {

        setLoadingRecords(false);

      }

    };

    loadMedicalRecords();

  }, [selectedPatientId]);


  // ======================================================
  // LOAD LONGITUDINAL AI ANALYSIS
  // ======================================================

  useEffect(() => {

    if (!selectedPatientId) {

      setLongitudinalAnalysis(null);
      setAIError("");

      return;

    }

    const loadLongitudinalAnalysis = async () => {

      try {

        setLoadingAI(true);

        setAIError("");

        const data =
          await getPatientLongitudinalAnalysis(
            selectedPatientId
          );

        setLongitudinalAnalysis(data);

      } catch (error) {

        console.error(
          "Failed to load longitudinal AI analysis:",
          error
        );

        setAIError(
          "Failed to generate longitudinal AI analysis."
        );

        setLongitudinalAnalysis(null);

      } finally {

        setLoadingAI(false);

      }

    };

    loadLongitudinalAnalysis();

  }, [selectedPatientId]);


  // ======================================================
  // SELECTED PATIENT
  // ======================================================

  const selectedPatient = patients.find(
    (patient) =>
      patient.id === selectedPatientId
  );


  // ======================================================
  // REPORT STATISTICS
  // ======================================================

  const reportStats = useMemo(() => {

    const riskRecords =
      medicalRecords.filter(
        (record) =>
          typeof record.ai_risk_score === "number"
      );

    const averageRisk =
      riskRecords.length > 0
        ? riskRecords.reduce(
            (sum, record) =>
              sum + record.ai_risk_score,
            0
          ) / riskRecords.length
        : null;

    const highRiskCount =
      riskRecords.filter(
        (record) =>
          record.ai_risk_score >= 70
      ).length;

    const latestRecord =
      medicalRecords.length > 0
        ? medicalRecords[
            medicalRecords.length - 1
          ]
        : null;

    return {
      totalVisits: medicalRecords.length,
      averageRisk,
      highRiskCount,
      latestRecord,
    };

  }, [medicalRecords]);


  // ======================================================
  // CHART DATA
  // ======================================================

  const riskChartData = useMemo(() => {

    return medicalRecords
      .filter(
        (record) =>
          typeof record.ai_risk_score === "number"
      )
      .map((record, index) => ({

        visit:
          record.visit_date
            ? new Date(
                record.visit_date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              )
            : `Visit ${index + 1}`,

        risk: record.ai_risk_score,

      }));

  }, [medicalRecords]);


  const vitalChartData = useMemo(() => {

    return medicalRecords.map(
      (record, index) => ({

        visit:
          record.visit_date
            ? new Date(
                record.visit_date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              )
            : `Visit ${index + 1}`,

        temperature:
          typeof record.temperature === "number"
            ? record.temperature
            : null,

        heartRate:
          typeof record.heart_rate === "number"
            ? record.heart_rate
            : null,

        oxygen:
          typeof record.oxygen_saturation ===
          "number"
            ? record.oxygen_saturation
            : null,

        respiratoryRate:
          typeof record.respiratory_rate ===
          "number"
            ? record.respiratory_rate
            : null,

      })
    );

  }, [medicalRecords]);


  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ======================================================
  // RISK LEVEL
  // ======================================================

  const getRiskLevel = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return "N/A";
    }

    if (score >= 70) {
      return "High";
    }

    if (score >= 40) {
      return "Moderate";
    }

    return "Low";

  };


  // ======================================================
  // AI LIST RENDERER
  // ======================================================

  const renderAIList = (items) => {

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return (
        <p className="text-gray-500">
          No information identified.
        </p>
      );

    }

    return (

      <ul className="space-y-3">

        {items.map((item, index) => (

          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3"
          >

            <span className="mt-2 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />

            <span className="text-slate-700 leading-relaxed">
              {item}
            </span>

          </li>

        ))}

      </ul>

    );

  };


  return (
    <PageLayout>

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

            <BarChart3
              size={26}
              className="text-purple-600"
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Reports & Analytics
            </h1>

            <p className="text-gray-500 mt-1">
              Analyze patient health trends and clinical history
            </p>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* PATIENT SELECTION */}
      {/* ================================================== */}

      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <Users
              size={20}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Select Patient
            </h2>

            <p className="text-sm text-gray-500">
              Choose a patient to generate their health report
            </p>

          </div>

        </div>


        {loadingPatients ? (

          <div className="flex items-center gap-2 text-gray-500">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading patients...

          </div>

        ) : (

          <select
            value={selectedPatientId}
            onChange={(e) =>
              setSelectedPatientId(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="">
              Select a patient
            </option>

            {patients.map((patient) => (

              <option
                key={patient.id}
                value={patient.id}
              >

                {patient.first_name}{" "}
                {patient.last_name}

                {patient.phone
                  ? ` — ${patient.phone}`
                  : ""}

              </option>

            ))}

          </select>

        )}

      </div>


      {/* ================================================== */}
      {/* EMPTY STATE */}
      {/* ================================================== */}

      {!selectedPatient &&
        !loadingPatients && (

          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

            <FileText
              size={48}
              className="text-gray-300 mx-auto mb-4"
            />

            <h2 className="text-xl font-bold text-slate-700 mb-2">
              Select a Patient
            </h2>

            <p className="text-gray-500">
              Select a patient above to view their
              health analytics and medical report.
            </p>

          </div>

        )}


      {/* ================================================== */}
      {/* PATIENT REPORT */}
      {/* ================================================== */}

      {selectedPatient && (

        <div className="space-y-8">


          {/* ============================================== */}
          {/* PATIENT HEADER */}
          {/* ============================================== */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">

                {selectedPatient.first_name?.charAt(0)}
                {selectedPatient.last_name?.charAt(0)}

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  {selectedPatient.first_name}{" "}
                  {selectedPatient.last_name}

                </h2>

                <p className="text-gray-500">

                  {selectedPatient.gender ||
                    "Gender not available"}

                  {selectedPatient.date_of_birth
                    ? ` • DOB: ${selectedPatient.date_of_birth}`
                    : ""}

                </p>

              </div>

            </div>

          </div>


          {/* ============================================== */}
          {/* LOADING RECORDS */}
          {/* ============================================== */}

          {loadingRecords && (

            <div className="bg-white rounded-2xl border p-12 text-center">

              <Loader2
                size={36}
                className="animate-spin text-purple-600 mx-auto mb-4"
              />

              <p className="text-gray-500">
                Loading patient's medical records...
              </p>

            </div>

          )}


          {/* ============================================== */}
          {/* ERROR */}
          {/* ============================================== */}

          {!loadingRecords &&
            recordsError && (

              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">

                <div className="flex items-center gap-3">

                  <AlertTriangle
                    size={24}
                    className="text-red-500"
                  />

                  <p className="text-red-700 font-medium">
                    {recordsError}
                  </p>

                </div>

              </div>

            )}


          {/* ============================================== */}
          {/* REPORT CONTENT */}
          {/* ============================================== */}

          {!loadingRecords &&
            !recordsError &&
            medicalRecords.length > 0 && (

              <>

                {/* ====================================== */}
                {/* SUMMARY CARDS */}
                {/* ====================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                  {/* Total Visits */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                        <CalendarDays
                          size={22}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Total Visits
                        </p>

                        <p className="text-2xl font-bold text-slate-800">
                          {reportStats.totalVisits}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Average Risk */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">

                        <Activity
                          size={22}
                          className="text-purple-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Average AI Risk
                        </p>

                        <p className="text-2xl font-bold text-slate-800">

                          {reportStats.averageRisk !== null
                            ? `${reportStats.averageRisk.toFixed(
                                1
                              )}%`
                            : "N/A"}

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* High Risk */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">

                        <AlertTriangle
                          size={22}
                          className="text-red-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          High Risk Visits
                        </p>

                        <p className="text-2xl font-bold text-slate-800">
                          {reportStats.highRiskCount}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Latest Risk */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">

                        <HeartPulse
                          size={22}
                          className="text-green-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Latest AI Risk
                        </p>

                        <p className="text-2xl font-bold text-slate-800">

                          {reportStats.latestRecord?.ai_risk_score !==
                          null &&
                          reportStats.latestRecord?.ai_risk_score !==
                          undefined
                            ? `${reportStats.latestRecord.ai_risk_score}%`
                            : "N/A"}

                        </p>

                        <p className="text-xs text-gray-500">
                          {getRiskLevel(
                            reportStats.latestRecord?.ai_risk_score
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ====================================== */}
                {/* AI RISK TREND */}
                {/* ====================================== */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                  <div className="flex items-center gap-3 mb-6">

                    <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">

                      <Activity
                        size={22}
                        className="text-purple-600"
                      />

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-slate-800">
                        AI Risk Score Trend
                      </h3>

                      <p className="text-sm text-gray-500">
                        Risk score changes across clinical visits
                      </p>

                    </div>

                  </div>


                  {riskChartData.length > 0 ? (

                    <div className="w-full h-[350px]">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <LineChart
                          data={riskChartData}
                          margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 10,
                          }}
                        >

                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis
                            dataKey="visit"
                          />

                          <YAxis
                            domain={[0, 100]}
                          />

                          <Tooltip />

                          <Legend />

                          <Line
                            type="monotone"
                            dataKey="risk"
                            name="AI Risk Score"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                          />

                        </LineChart>

                      </ResponsiveContainer>

                    </div>

                  ) : (

                    <div className="text-center py-12 text-gray-500">
                      No AI risk scores available for charting.
                    </div>

                  )}

                </div>


                {/* ====================================== */}
                {/* VITAL SIGN TRENDS */}
                {/* ====================================== */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                  <div className="flex items-center gap-3 mb-6">

                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                      <HeartPulse
                        size={22}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-slate-800">
                        Vital Sign Trends
                      </h3>

                      <p className="text-sm text-gray-500">
                        Recorded vital signs across visits
                      </p>

                    </div>

                  </div>


                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Temperature */}

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <Thermometer
                          size={19}
                          className="text-orange-500"
                        />

                        <h4 className="font-semibold text-slate-700">
                          Temperature
                        </h4>

                      </div>

                      <div className="h-[280px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <LineChart
                            data={vitalChartData}
                          >

                            <CartesianGrid
                              strokeDasharray="3 3"
                            />

                            <XAxis
                              dataKey="visit"
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature °F"
                              strokeWidth={3}
                              connectNulls
                            />

                          </LineChart>

                        </ResponsiveContainer>

                      </div>

                    </div>


                    {/* Heart Rate */}

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <Heart
                          size={19}
                          className="text-red-500"
                        />

                        <h4 className="font-semibold text-slate-700">
                          Heart Rate
                        </h4>

                      </div>

                      <div className="h-[280px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <LineChart
                            data={vitalChartData}
                          >

                            <CartesianGrid
                              strokeDasharray="3 3"
                            />

                            <XAxis
                              dataKey="visit"
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="heartRate"
                              name="Heart Rate bpm"
                              strokeWidth={3}
                              connectNulls
                            />

                          </LineChart>

                        </ResponsiveContainer>

                      </div>

                    </div>


                    {/* Oxygen */}

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <Wind
                          size={19}
                          className="text-cyan-600"
                        />

                        <h4 className="font-semibold text-slate-700">
                          Oxygen Saturation
                        </h4>

                      </div>

                      <div className="h-[280px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <LineChart
                            data={vitalChartData}
                          >

                            <CartesianGrid
                              strokeDasharray="3 3"
                            />

                            <XAxis
                              dataKey="visit"
                            />

                            <YAxis
                              domain={[
                                "auto",
                                "auto",
                              ]}
                            />

                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="oxygen"
                              name="SpO₂ %"
                              strokeWidth={3}
                              connectNulls
                            />

                          </LineChart>

                        </ResponsiveContainer>

                      </div>

                    </div>


                    {/* Respiratory Rate */}

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <Wind
                          size={19}
                          className="text-green-600"
                        />

                        <h4 className="font-semibold text-slate-700">
                          Respiratory Rate
                        </h4>

                      </div>

                      <div className="h-[280px]">

                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                        >

                          <LineChart
                            data={vitalChartData}
                          >

                            <CartesianGrid
                              strokeDasharray="3 3"
                            />

                            <XAxis
                              dataKey="visit"
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="respiratoryRate"
                              name="Respiratory Rate"
                              strokeWidth={3}
                              connectNulls
                            />

                          </LineChart>

                        </ResponsiveContainer>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ====================================== */}
                {/* CLINICAL HISTORY */}
                {/* ====================================== */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                  <div className="flex items-center gap-3 mb-6">

                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">

                      <FileText
                        size={22}
                        className="text-green-600"
                      />

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-slate-800">
                        Clinical History
                      </h3>

                      <p className="text-sm text-gray-500">
                        Patient's recorded clinical visits
                      </p>

                    </div>

                  </div>


                  <div className="overflow-x-auto">

                    <table className="min-w-full">

                      <thead className="bg-slate-100">

                        <tr>

                          <th className="px-4 py-3 text-left text-sm">
                            Date
                          </th>

                          <th className="px-4 py-3 text-left text-sm">
                            Visit Type
                          </th>

                          <th className="px-4 py-3 text-left text-sm">
                            Chief Complaint
                          </th>

                          <th className="px-4 py-3 text-left text-sm">
                            Diagnosis
                          </th>

                          <th className="px-4 py-3 text-left text-sm">
                            AI Risk
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {medicalRecords.map(
                          (record) => (

                            <tr
                              key={record.id}
                              className="border-b hover:bg-slate-50"
                            >

                              <td className="px-4 py-4 text-sm">
                                {formatDate(
                                  record.visit_date
                                )}
                              </td>

                              <td className="px-4 py-4 text-sm capitalize">
                                {record.visit_type
                                  ?.replaceAll(
                                    "_",
                                    " "
                                  ) || "-"}
                              </td>

                              <td className="px-4 py-4 text-sm">
                                {record.chief_complaint ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-sm">
                                {record.diagnosis ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-sm font-semibold">

                                {record.ai_risk_score !==
                                null &&
                                record.ai_risk_score !==
                                undefined
                                  ? `${record.ai_risk_score}%`
                                  : "N/A"}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>


                {/* ====================================== */}
                {/* LONGITUDINAL AI INSIGHTS */}
                {/* ====================================== */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                  <div className="flex items-center gap-3 mb-6">

                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

                      <Brain
                        size={25}
                        className="text-purple-600"
                      />

                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-slate-800">
                        Longitudinal AI Insights
                      </h3>

                      <p className="text-sm text-gray-500">
                        AI-powered analysis of the patient's complete clinical history
                      </p>

                    </div>

                  </div>


                  {/* AI LOADING */}

                  {loadingAI && (

                    <div className="py-12 text-center">

                      <Loader2
                        size={36}
                        className="animate-spin text-purple-600 mx-auto mb-4"
                      />

                      <p className="text-gray-500">
                        Analyzing patient's complete medical history...
                      </p>

                    </div>

                  )}


                  {/* AI ERROR */}

                  {!loadingAI &&
                    aiError && (

                      <div className="bg-red-50 border border-red-100 rounded-xl p-5">

                        <div className="flex items-center gap-3">

                          <AlertTriangle
                            size={22}
                            className="text-red-500"
                          />

                          <p className="text-red-700">
                            {aiError}
                          </p>

                        </div>

                      </div>

                    )}


                  {/* AI RESULTS */}

                  {!loadingAI &&
                    !aiError &&
                    longitudinalAnalysis && (

                      <div className="space-y-6">

                        {/* ================================= */}
                        {/* AI SUMMARY CARDS */}
                        {/* ================================= */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                          {/* Health Trend */}

                          <div className="bg-slate-50 border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                              Overall Health Trend
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                              {longitudinalAnalysis.overall_health_trend ||
                                "Insufficient Data"}
                            </p>

                          </div>


                          {/* Risk Level */}

                          <div className="bg-slate-50 border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                              Overall Risk Level
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                              {longitudinalAnalysis.overall_risk_level ||
                                "Insufficient Data"}
                            </p>

                          </div>


                          {/* Average Risk */}

                          <div className="bg-slate-50 border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                              Average Risk Score
                            </p>

                            <p className="text-xl font-bold text-slate-800">

                              {typeof longitudinalAnalysis.average_risk_score ===
                              "number"
                                ? `${longitudinalAnalysis.average_risk_score.toFixed(
                                    1
                                  )}%`
                                : "N/A"}

                            </p>

                          </div>

                        </div>


                        {/* ================================= */}
                        {/* RISK EVOLUTION */}
                        {/* ================================= */}

                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">

                          <h4 className="text-lg font-bold text-purple-800 mb-3">
                            Risk Evolution
                          </h4>

                          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {longitudinalAnalysis.risk_evolution ||
                              "No risk evolution information available."}
                          </p>

                        </div>


                        {/* ================================= */}
                        {/* KEY OBSERVATIONS */}
                        {/* ================================= */}

                        <div>

                          <h4 className="text-lg font-bold text-slate-800 mb-3">
                            Key Observations
                          </h4>

                          {renderAIList(
                            longitudinalAnalysis.key_observations
                          )}

                        </div>


                        {/* ================================= */}
                        {/* RECURRING CONDITIONS */}
                        {/* ================================= */}

                        <div>

                          <h4 className="text-lg font-bold text-slate-800 mb-3">
                            Recurring Conditions
                          </h4>

                          {renderAIList(
                            longitudinalAnalysis.recurring_conditions
                          )}

                        </div>


                        {/* ================================= */}
                        {/* RECURRING COMPLAINTS */}
                        {/* ================================= */}

                        <div>

                          <h4 className="text-lg font-bold text-slate-800 mb-3">
                            Recurring Complaints
                          </h4>

                          {renderAIList(
                            longitudinalAnalysis.recurring_complaints
                          )}

                        </div>


                        {/* ================================= */}
                        {/* IMPORTANT CHANGES */}
                        {/* ================================= */}

                        <div>

                          <h4 className="text-lg font-bold text-slate-800 mb-3">
                            Important Changes
                          </h4>

                          {renderAIList(
                            longitudinalAnalysis.important_changes
                          )}

                        </div>


                        {/* ================================= */}
                        {/* FOLLOW-UP RECOMMENDATIONS */}
                        {/* ================================= */}

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                          <h4 className="text-lg font-bold text-blue-800 mb-3">
                            Follow-up Recommendations
                          </h4>

                          {renderAIList(
                            longitudinalAnalysis.follow_up_recommendations
                          )}

                        </div>


                        {/* ================================= */}
                        {/* AI DISCLAIMER */}
                        {/* ================================= */}

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">

                          <p className="text-sm text-amber-800 leading-relaxed">

                            <strong>
                              AI Insight Notice:
                            </strong>{" "}

                            These longitudinal insights are generated by AI
                            from the patient's available clinical records.
                            They are intended to assist healthcare
                            professionals in reviewing patient history and
                            should not replace professional medical judgment.

                          </p>

                        </div>

                      </div>

                    )}

                </div>

              </>

            )}


          {/* ============================================== */}
          {/* NO RECORDS */}
          {/* ============================================== */}

          {!loadingRecords &&
            !recordsError &&
            medicalRecords.length === 0 && (

              <div className="bg-white border rounded-2xl p-12 text-center">

                <FileText
                  size={44}
                  className="text-gray-300 mx-auto mb-4"
                />

                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No Medical Records
                </h3>

                <p className="text-gray-500">
                  This patient does not have any medical
                  records available for analysis.
                </p>

              </div>

            )}

        </div>

      )}

    </PageLayout>
  );
}

export default Reports;
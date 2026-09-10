import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  Brain,
  AlertTriangle,
  Activity,
  Clock,
  ShieldAlert,
  Database,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import PageLayout from "../../components/layout/PageLayout";
import StatCard from "../../components/dashboard/StatCard";

import {
  getDashboardStats,
  getDiabetesModelMetrics,
} from "../../services/dashboardService";


function Dashboard() {

  const [stats, setStats] = useState({
    total_patients: 0,
    total_medical_records: 0,
    total_ai_analyses: 0,
    high_risk_cases: 0,
    moderate_risk_cases: 0,
    low_risk_cases: 0,
    insufficient_data_cases: 0,
    recent_records: [],
  });

  const [loading, setLoading] = useState(true);

  const [mlMetrics, setMlMetrics] = useState(null);
  const [mlLoading, setMlLoading] = useState(true);


  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {

  async function loadDashboard() {

    try {

      const [dashboardData, mlData] = await Promise.all([
        getDashboardStats(),
        getDiabetesModelMetrics(),
      ]);

      setStats(dashboardData);
      setMlMetrics(mlData);

    } catch (error) {

      console.error(
        "Failed to load dashboard:",
        error
      );

    } finally {

      setLoading(false);
      setMlLoading(false);

    }

  }

  loadDashboard();

}, []);


  // =====================================================
  // RISK DISTRIBUTION DATA
  // =====================================================

  const riskData = [
    {
      name: "High Risk",
      value: stats.high_risk_cases,
    },
    {
      name: "Moderate Risk",
      value: stats.moderate_risk_cases,
    },
    {
      name: "Low Risk",
      value: stats.low_risk_cases,
    },
    {
      name: "Insufficient Data",
      value: stats.insufficient_data_cases,
    },
  ];


  // =====================================================
  // RISK COLORS
  // =====================================================

  const riskColors = [
    "#ef4444",
    "#f59e0b",
    "#22c55e",
    "#94a3b8",
  ];
    // =====================================================
  // RANDOM FOREST FEATURE IMPORTANCE DATA
  // =====================================================

  const featureImportanceData =
    mlMetrics?.feature_importance
      ? Object.entries(
          mlMetrics.feature_importance
        )
          .map(([feature, importance]) => ({
            feature,
            importance: importance * 100,
          }))
          .sort(
            (a, b) =>
              b.importance - a.importance
          )
      : [];


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (

      <PageLayout>

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="text-xl text-slate-500">

            Loading Dashboard...

          </div>

        </div>

      </PageLayout>

    );

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <PageLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">

          Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Welcome back 👋 Here's an overview of
          your MedAssist AI system.

        </p>

      </div>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Patients"
          value={stats.total_patients}
          icon={<Users size={28} />}
          color="bg-blue-600"
        />

        <StatCard
          title="Medical Records"
          value={stats.total_medical_records}
          icon={<FileText size={28} />}
          color="bg-green-600"
        />

        <StatCard
          title="AI Analyses"
          value={stats.total_ai_analyses}
          icon={<Brain size={28} />}
          color="bg-purple-600"
        />

        <StatCard
          title="High Risk Cases"
          value={stats.high_risk_cases}
          icon={<AlertTriangle size={28} />}
          color="bg-red-600"
        />

      </div>


      {/* =================================================
          SECONDARY STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Moderate Risk */}

        <div className="bg-white rounded-2xl shadow p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Moderate Risk
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.moderate_risk_cases}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">

              <ShieldAlert
                size={25}
                className="text-yellow-600"
              />

            </div>

          </div>

        </div>


        {/* Low Risk */}

        <div className="bg-white rounded-2xl shadow p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Low Risk
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.low_risk_cases}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

              <Activity
                size={25}
                className="text-green-600"
              />

            </div>

          </div>

        </div>


        {/* Insufficient Data */}

        <div className="bg-white rounded-2xl shadow p-6 border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Insufficient Data
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.insufficient_data_cases}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">

              <Database
                size={25}
                className="text-slate-500"
              />

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          ANALYTICS SECTION
      ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">


        {/* =================================================
            RISK DISTRIBUTION
        ================================================= */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

              <Brain
                size={21}
                className="text-purple-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">

                AI Risk Distribution

              </h2>

              <p className="text-sm text-gray-500">

                Distribution of assessed medical records

              </p>

            </div>

          </div>


          {riskData.every(
            (item) => item.value === 0
          ) ? (

            <div className="h-[300px] flex items-center justify-center text-gray-500">

              No AI risk data available.

            </div>

          ) : (

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >

                    {riskData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            riskColors[index]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* =================================================
            SYSTEM OVERVIEW
        ================================================= */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

              <Activity
                size={21}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">

                Clinical AI Overview

              </h2>

              <p className="text-sm text-gray-500">

                Current system activity

              </p>

            </div>

          </div>


          <div className="space-y-5">


            {/* AI Analysis Coverage */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-slate-600">

                  AI Analysis Coverage

                </span>

                <span className="text-sm font-semibold text-slate-800">

                  {
                    stats.total_medical_records > 0
                      ? Math.round(
                          (
                            stats.total_ai_analyses /
                            stats.total_medical_records
                          ) * 100
                        )
                      : 0
                  }%

                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.total_medical_records > 0
                        ? Math.min(
                            100,
                            (
                              stats.total_ai_analyses /
                              stats.total_medical_records
                            ) * 100
                          )
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>


            {/* High Risk Percentage */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-slate-600">

                  High Risk Records

                </span>

                <span className="text-sm font-semibold text-red-600">

                  {
                    stats.total_medical_records > 0
                      ? Math.round(
                          (
                            stats.high_risk_cases /
                            stats.total_medical_records
                          ) * 100
                        )
                      : 0
                  }%

                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.total_medical_records > 0
                        ? Math.min(
                            100,
                            (
                              stats.high_risk_cases /
                              stats.total_medical_records
                            ) * 100
                          )
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>


            {/* Data Quality */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-slate-600">

                  Complete AI Assessments

                </span>

                <span className="text-sm font-semibold text-green-600">

                  {
  stats.total_medical_records > 0
    ? Math.round(
        (
          stats.total_ai_analyses /
          stats.total_medical_records
        ) * 100
      )
    : 0
}%

                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${
  stats.total_medical_records > 0
    ? Math.min(
        100,
        (
          stats.total_ai_analyses /
          stats.total_medical_records
        ) * 100
      )
    : 0
}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* =================================================
          MACHINE LEARNING MODEL PERFORMANCE
      ================================================= */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

            <Brain
              size={21}
              className="text-purple-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Machine Learning Model Performance

            </h2>

            <p className="text-sm text-gray-500">

              Performance of the integrated diabetes screening model

            </p>

          </div>

        </div>


        {mlLoading ? (

          <div className="py-10 text-center text-gray-500">

            Loading ML model metrics...

          </div>

        ) : mlMetrics ? (

          <>

            {/* Model Information */}

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    Algorithm
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {mlMetrics.algorithm}
                  </p>

                </div>


                <div>

                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    Dataset
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {mlMetrics.dataset}
                  </p>

                </div>

              </div>

            </div>


            {/* Performance Metrics */}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

              <MLMetricCard
                label="Accuracy"
                value={`${mlMetrics.accuracy.toFixed(2)}%`}
              />

              <MLMetricCard
                label="Precision"
                value={`${mlMetrics.precision.toFixed(2)}%`}
              />

              <MLMetricCard
                label="Recall"
                value={`${mlMetrics.recall.toFixed(2)}%`}
              />

              <MLMetricCard
                label="F1 Score"
                value={`${mlMetrics.f1_score.toFixed(2)}%`}
              />

              <MLMetricCard
                label="ROC-AUC"
                value={mlMetrics.roc_auc.toFixed(2)}
              />

              <MLMetricCard
                label="CV F1 Score"
                value={`${mlMetrics.cv_f1_mean.toFixed(2)}%`}
                subtitle={`± ${mlMetrics.cv_f1_std.toFixed(2)}%`}
              />

            </div>


            {/* ML Information */}

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-sm text-slate-600 leading-relaxed">

                The Random Forest Classifier was trained using the
                UCI Early Stage Diabetes Risk Prediction Dataset.
                The displayed values represent the evaluation results
                obtained during model training and testing.

              </p>

            </div>

          </>

        ) : (

          <div className="py-10 text-center text-gray-500">

            ML model metrics are currently unavailable.

          </div>

        )}

      </div>
            {/* =================================================
          RANDOM FOREST FEATURE IMPORTANCE
      ================================================= */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <Brain
              size={21}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Random Forest Feature Importance

            </h2>

            <p className="text-sm text-gray-500">

              Relative importance of features used by the diabetes
              screening model

            </p>

          </div>

        </div>


        {mlLoading ? (

          <div className="py-10 text-center text-gray-500">

            Loading feature importance...

          </div>

        ) : featureImportanceData.length > 0 ? (

          <div className="w-full overflow-x-auto">

            <div
              className="min-w-[700px]"
              style={{
                height: Math.max(
                  500,
                  featureImportanceData.length * 38
                ),
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 40,
                    left: 30,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    domain={[0, "dataMax"]}
                    tickFormatter={(value) =>
                      `${value.toFixed(0)}%`
                    }
                  />

                  <YAxis
                    type="category"
                    dataKey="feature"
                    width={150}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Importance",
                    ]}
                  />

                  <Bar
                    dataKey="importance"
                    fill="#7c3aed"
                    radius={[0, 6, 6, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        ) : (

          <div className="py-10 text-center text-gray-500">

            Feature importance data is currently unavailable.

          </div>

        )}


        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">

          <p className="text-sm text-slate-600 leading-relaxed">

            Feature importance indicates the relative contribution
            of each input feature to the Random Forest model's
            predictions on the training dataset. Higher values
            indicate greater importance within this trained model
            and do not represent independent medical significance.

          </p>

        </div>

      </div>
            {/* =================================================
          RANDOM FOREST CONFUSION MATRIX
      ================================================= */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">

            <Brain
              size={21}
              className="text-green-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Random Forest Confusion Matrix

            </h2>

            <p className="text-sm text-gray-500">

              Classification results on the held-out test dataset

            </p>

          </div>

        </div>


        {mlLoading ? (

          <div className="py-10 text-center text-gray-500">

            Loading confusion matrix...

          </div>

        ) : mlMetrics?.confusion_matrix ? (

          <>

            {/* Confusion Matrix */}

            <div className="max-w-2xl mx-auto">

              {/* Predicted Label */}

              <p className="text-center text-sm font-semibold text-slate-600 mb-3">

                Predicted Class

              </p>


              <div className="grid grid-cols-[120px_1fr_1fr] gap-2">

                {/* Empty corner */}

                <div></div>


                {/* Predicted Negative */}

                <div className="text-center text-sm font-semibold text-slate-600 pb-2">

                  Negative

                </div>


                {/* Predicted Positive */}

                <div className="text-center text-sm font-semibold text-slate-600 pb-2">

                  Positive

                </div>


                {/* Actual Negative Label */}

                <div className="flex items-center justify-end pr-4 text-sm font-semibold text-slate-600">

                  Actual Negative

                </div>


                {/* True Negative */}

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">

                  <p className="text-3xl font-bold text-green-700">

                    {mlMetrics.confusion_matrix[0][0]}

                  </p>

                  <p className="text-xs font-semibold text-green-700 mt-2">

                    True Negative (TN)

                  </p>

                </div>


                {/* False Positive */}

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

                  <p className="text-3xl font-bold text-red-700">

                    {mlMetrics.confusion_matrix[0][1]}

                  </p>

                  <p className="text-xs font-semibold text-red-700 mt-2">

                    False Positive (FP)

                  </p>

                </div>


                {/* Actual Positive Label */}

                <div className="flex items-center justify-end pr-4 text-sm font-semibold text-slate-600">

                  Actual Positive

                </div>


                {/* False Negative */}

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

                  <p className="text-3xl font-bold text-red-700">

                    {mlMetrics.confusion_matrix[1][0]}

                  </p>

                  <p className="text-xs font-semibold text-red-700 mt-2">

                    False Negative (FN)

                  </p>

                </div>


                {/* True Positive */}

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">

                  <p className="text-3xl font-bold text-green-700">

                    {mlMetrics.confusion_matrix[1][1]}

                  </p>

                  <p className="text-xs font-semibold text-green-700 mt-2">

                    True Positive (TP)

                  </p>

                </div>

              </div>

            </div>


            {/* Test Set Summary */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

              <MLMetricCard
                label="True Negatives"
                value={mlMetrics.confusion_matrix[0][0]}
              />

              <MLMetricCard
                label="False Positives"
                value={mlMetrics.confusion_matrix[0][1]}
              />

              <MLMetricCard
                label="False Negatives"
                value={mlMetrics.confusion_matrix[1][0]}
              />

              <MLMetricCard
                label="True Positives"
                value={mlMetrics.confusion_matrix[1][1]}
              />

            </div>


            {/* Explanation */}

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-sm text-slate-600 leading-relaxed">

                The confusion matrix summarizes the predictions
                made by the Random Forest Classifier on the test
                dataset. The model correctly classified 40 negative
                cases and 61 positive cases, while 3 positive cases
                were incorrectly classified as negative. No negative
                cases were incorrectly classified as positive.

              </p>

            </div>

          </>

        ) : (

          <div className="py-10 text-center text-gray-500">

            Confusion matrix data is currently unavailable.

          </div>

        )}

      </div>


      {/* =================================================
          RECENT MEDICAL ACTIVITY
      ================================================= */}

      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <div className="p-6 border-b">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

              <Clock
                size={21}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">

                Recent Medical Activity

              </h2>

              <p className="text-sm text-gray-500">

                Latest patient medical records

              </p>

            </div>

          </div>

        </div>


        {stats.recent_records.length === 0 ? (

          <div className="p-10 text-center text-gray-500">

            No medical records available.

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Visit Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Visit Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Chief Complaint
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                    Risk
                  </th>

                </tr>

              </thead>


              <tbody>

                {stats.recent_records.map(
                  (record) => (

                    <tr
                      key={record.id}
                      className="border-t hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-4">

                        <div className="font-semibold text-slate-800">

                          {record.patient_name}

                        </div>

                      </td>


                      <td className="px-6 py-4 text-sm text-slate-600">

                        {record.visit_date}

                      </td>


                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">

                          {record.visit_type}

                        </span>

                      </td>


                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">

                        <div className="truncate">

                          {record.chief_complaint || "-"}

                        </div>

                      </td>


                      <td className="px-6 py-4 text-center">

                        {record.ai_risk_score === null ? (

                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">

                            Insufficient Data

                          </span>

                        ) : record.ai_risk_level === "High" ? (

                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">

                            High ({record.ai_risk_score})

                          </span>

                        ) : record.ai_risk_level === "Moderate" ? (

                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">

                            Moderate ({record.ai_risk_score})

                          </span>

                        ) : (

                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                            Low ({record.ai_risk_score})

                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          AI DISCLAIMER
      ================================================= */}

      <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">

        <strong>MedAssist AI Notice:</strong>{" "}

        Dashboard insights and risk classifications are
        generated from available medical records and AI
        analysis. They are intended to support healthcare
        professionals and should not replace professional
        medical judgment.

      </div>

    </PageLayout>

  );

}
function MLMetricCard({
  label,
  value,
  subtitle,
}) {

  return (

    <div className="bg-slate-50 rounded-xl p-4 border">

      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-800 mt-2">
        {value}
      </p>

      {subtitle && (

        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>

      )}

    </div>

  );

}
export default Dashboard;
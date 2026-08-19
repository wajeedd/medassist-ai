import {
  Brain,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";

import PageLayout from "../../components/layout/PageLayout";

function AI() {
  return (
    <PageLayout>

      {/* Header */}

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
              AI-powered clinical decision support and patient analysis.
            </p>

          </div>

        </div>

      </div>


      {/* AI Features */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Medical Record Analysis */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5">

            <Sparkles
              size={24}
              className="text-purple-600"
            />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Medical Record Analysis
          </h2>

          <p className="text-gray-500">
            Analyze individual medical records using
            AI-powered clinical decision support.
          </p>

        </div>


        {/* Risk Assessment */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-5">

            <ShieldCheck
              size={24}
              className="text-red-600"
            />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Risk Assessment
          </h2>

          <p className="text-gray-500">
            Review AI-generated clinical risk scores,
            risk levels, and important observations.
          </p>

        </div>


        {/* Longitudinal Analysis */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">

            <Activity
              size={24}
              className="text-blue-600"
            />

          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Longitudinal Insights
          </h2>

          <p className="text-gray-500">
            Analyze complete patient history to identify
            trends, recurring concerns, and risk evolution.
          </p>

        </div>

      </div>


      {/* AI Notice */}

      <div className="mt-8 p-6 rounded-2xl bg-purple-50 border border-purple-100">

        <div className="flex items-start gap-4">

          <Brain
            size={24}
            className="text-purple-600 mt-1"
          />

          <div>

            <h3 className="font-bold text-purple-900">
              MedAssist AI Clinical Decision Support
            </h3>

            <p className="text-sm text-purple-800 mt-2">

              AI-generated insights are intended to assist
              healthcare professionals in reviewing patient
              information. They should not replace professional
              medical judgment or clinical diagnosis.

            </p>

          </div>

        </div>

      </div>

    </PageLayout>
  );
}

export default AI;
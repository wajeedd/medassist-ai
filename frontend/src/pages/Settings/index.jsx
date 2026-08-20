import { useEffect, useState } from "react";

import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Save,
  LogOut,
  CheckCircle,
  Brain,
  FileText,
} from "lucide-react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import { useAuth } from "../../contexts/AuthContext";


function Settings() {

  const navigate = useNavigate();

  const { logout } = useAuth();


  // =====================================================
  // PROFILE
  // =====================================================

  const [profile, setProfile] = useState(() => {

    const savedProfile =
      localStorage.getItem("medassist_profile");

    if (savedProfile) {

      try {
        return JSON.parse(savedProfile);
      } catch {
        // Use default profile
      }

    }

    return {
      name: "Dr. Shaik Wajeed",
      role: "Doctor",
      email: "",
      phone: "",
    };

  });


  // =====================================================
  // NOTIFICATION SETTINGS
  // =====================================================

  const [notifications, setNotifications] = useState(() => {

    const saved =
      localStorage.getItem(
        "medassist_notifications"
      );

    if (saved) {

      try {
        return JSON.parse(saved);
      } catch {
        // Use defaults
      }

    }

    return {
      riskAlerts: true,
      aiInsights: true,
      reportNotifications: true,
    };

  });


  // =====================================================
  // APPLICATION SETTINGS
  // =====================================================

  const [applicationSettings, setApplicationSettings] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "medassist_application_settings"
        );

      if (saved) {

        try {
          return JSON.parse(saved);
        } catch {
          // Use defaults
        }

      }

      return {
        aiDecisionSupport: true,
        automaticReports: false,
        showClinicalDisclaimer: true,
      };

    });


  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = () => {

    localStorage.setItem(
      "medassist_profile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "medassist_notifications",
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "medassist_application_settings",
      JSON.stringify(applicationSettings)
    );

    toast.success(
      "Settings saved successfully."
    );

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    navigate("/login", {
      replace: true,
    });

  };


  // =====================================================
  // PROFILE CHANGE
  // =====================================================

  const handleProfileChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // LOAD PROFILE NAME FOR HEADER
  // =====================================================

  useEffect(() => {

    window.dispatchEvent(
      new Event("medassist-profile-updated")
    );

  }, [profile]);


  return (

    <PageLayout>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your MedAssist AI application settings.
        </p>

      </div>


      {/* ==================================================
          PROFILE
      ================================================== */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

            <User
              size={24}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Profile
            </h2>

            <p className="text-sm text-gray-500">
              Manage your account information.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>

            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="doctor@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          SECURITY
      ================================================== */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

            <Shield
              size={24}
              className="text-green-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Security
            </h2>

            <p className="text-sm text-gray-500">
              Manage your application session.
            </p>

          </div>

        </div>


        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">

          <div className="flex items-center gap-3">

            <CheckCircle
              size={22}
              className="text-green-600"
            />

            <div>

              <p className="font-semibold text-green-900">
                Authentication Active
              </p>

              <p className="text-sm text-green-700">
                Your current session is authenticated.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </div>


      {/* ==================================================
          NOTIFICATIONS
      ================================================== */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

            <Bell
              size={24}
              className="text-purple-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Notifications
            </h2>

            <p className="text-sm text-gray-500">
              Configure notification preferences.
            </p>

          </div>

        </div>


        <div className="space-y-4">

          {/* Risk Alerts */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div>

              <p className="font-semibold text-slate-800">
                High-Risk Alerts
              </p>

              <p className="text-sm text-gray-500">
                Receive alerts for high-risk patient cases.
              </p>

            </div>

            <input
              type="checkbox"
              checked={notifications.riskAlerts}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  riskAlerts: e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>


          {/* AI Insights */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div>

              <p className="font-semibold text-slate-800">
                AI Insights
              </p>

              <p className="text-sm text-gray-500">
                Receive notifications about new AI-generated insights.
              </p>

            </div>

            <input
              type="checkbox"
              checked={notifications.aiInsights}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  aiInsights: e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>


          {/* Reports */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div>

              <p className="font-semibold text-slate-800">
                Report Notifications
              </p>

              <p className="text-sm text-gray-500">
                Enable notifications related to generated reports.
              </p>

            </div>

            <input
              type="checkbox"
              checked={notifications.reportNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  reportNotifications: e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>

        </div>

      </div>


      {/* ==================================================
          APPLICATION
      ================================================== */}

      <div className="bg-white rounded-2xl shadow border p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">

            <SettingsIcon
              size={24}
              className="text-slate-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Application
            </h2>

            <p className="text-sm text-gray-500">
              Configure MedAssist AI behavior.
            </p>

          </div>

        </div>


        <div className="space-y-4">

          {/* AI Decision Support */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div className="flex items-center gap-4">

              <Brain
                size={22}
                className="text-purple-600"
              />

              <div>

                <p className="font-semibold text-slate-800">
                  AI Clinical Decision Support
                </p>

                <p className="text-sm text-gray-500">
                  Enable AI-powered clinical analysis features.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={
                applicationSettings.aiDecisionSupport
              }
              onChange={(e) =>
                setApplicationSettings({
                  ...applicationSettings,
                  aiDecisionSupport:
                    e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>


          {/* Automatic Reports */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div className="flex items-center gap-4">

              <FileText
                size={22}
                className="text-blue-600"
              />

              <div>

                <p className="font-semibold text-slate-800">
                  Automatic Report Preferences
                </p>

                <p className="text-sm text-gray-500">
                  Enable automatic report-related preferences.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={
                applicationSettings.automaticReports
              }
              onChange={(e) =>
                setApplicationSettings({
                  ...applicationSettings,
                  automaticReports:
                    e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>


          {/* Disclaimer */}

          <label className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 cursor-pointer">

            <div>

              <p className="font-semibold text-slate-800">
                Clinical AI Disclaimer
              </p>

              <p className="text-sm text-gray-500">
                Show the clinical decision-support disclaimer.
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                applicationSettings.showClinicalDisclaimer
              }
              onChange={(e) =>
                setApplicationSettings({
                  ...applicationSettings,
                  showClinicalDisclaimer:
                    e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600"
            />

          </label>

        </div>

      </div>


      {/* ==================================================
          SAVE BUTTON
      ================================================== */}

      <div className="flex justify-end mb-8">

        <button
          type="button"
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
        >

          <Save size={19} />

          Save Settings

        </button>

      </div>


      {/* ==================================================
          NOTICE
      ================================================== */}

      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">

        <p className="text-sm text-blue-800">

          <strong>MedAssist AI:</strong>{" "}

          Application preferences are stored locally in
          this browser. AI-generated insights are intended
          to support healthcare professionals and should
          not replace professional medical judgment or
          clinical diagnosis.

        </p>

      </div>

    </PageLayout>

  );
}

export default Settings;
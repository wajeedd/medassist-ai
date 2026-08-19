import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
} from "lucide-react";

import PageLayout from "../../components/layout/PageLayout";


function Settings() {

  return (

    <PageLayout>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">

          Settings

        </h1>

        <p className="text-gray-500 mt-2">

          Manage your MedAssist AI application settings.

        </p>

      </div>


      {/* ==========================================
          SETTINGS CARDS
      ========================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* Profile */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-4 mb-5">

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

          <p className="text-gray-600">

            Profile management options will be
            available here.

          </p>

        </div>


        {/* Security */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-4 mb-5">

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

                Manage application security.

              </p>

            </div>

          </div>

          <p className="text-gray-600">

            Security and authentication settings
            will be managed here.

          </p>

        </div>


        {/* Notifications */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-4 mb-5">

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

          <p className="text-gray-600">

            Notification preferences will be
            available here.

          </p>

        </div>


        {/* Application */}

        <div className="bg-white rounded-2xl shadow border p-6">

          <div className="flex items-center gap-4 mb-5">

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

                MedAssist AI configuration.

              </p>

            </div>

          </div>

          <p className="text-gray-600">

            Application preferences and configuration
            options will be available here.

          </p>

        </div>

      </div>


      {/* ==========================================
          APPLICATION NOTICE
      ========================================== */}

      <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-100">

        <p className="text-sm text-blue-800">

          <strong>MedAssist AI:</strong>{" "}

          Settings are currently focused on application
          configuration. Additional account and system
          preferences can be added as the platform evolves.

        </p>

      </div>

    </PageLayout>

  );

}

export default Settings;
import {
  LayoutDashboard,
  Users,
  FileText,
  Brain,
  FileDown,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Patients",
      icon: Users,
      path: "/patients",
    },
    {
      name: "Medical Records",
      icon: FileText,
      path: "/medical-records",
    },
    {
      name: "AI Analysis",
      icon: Brain,
      path: "/ai-analysis",
    },
    {
      name: "Reports",
      icon: FileDown,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col">

      <div className="text-center py-8">

        <h1 className="text-3xl font-bold text-blue-400">
          🏥
        </h1>

        <h2 className="text-xl font-bold mt-2">
          MedAssist AI
        </h2>

      </div>

      <nav className="flex-1">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >

              <Icon size={20} />

              <span>{item.name}</span>

            </NavLink>
          );

        })}

      </nav>

      <button
        className="flex items-center gap-4 px-6 py-5 hover:bg-red-600 transition"
      >

        <LogOut size={20} />

        Logout

      </button>

    </aside>
  );

}

export default Sidebar;
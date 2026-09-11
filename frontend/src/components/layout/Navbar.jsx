import { Bell, UserCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {

  const { user } = useAuth();

  return (

    <header className="bg-white shadow-sm h-20 px-8 flex items-center justify-between">

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back 👋
        </p>

      </div>


      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell
            size={24}
            className="text-slate-700"
          />

          <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></span>

        </button>


        <div className="flex items-center gap-3">

          <UserCircle
            size={42}
            className="text-blue-600"
          />


          <div>

            <h2 className="font-semibold">

              {user?.full_name || "Doctor"}

            </h2>


            <p className="text-sm text-gray-500">

              {user?.role
                ? user.role.charAt(0).toUpperCase() +
                  user.role.slice(1)
                : "Doctor"}

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}

export default Navbar;
import { useState } from "react";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await loginService(
        email,
        password
      );

      login(response.access_token);

      navigate("/dashboard");

    } catch (err) {

      if (err.response) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to connect to server.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-4 rounded-full">
            <Stethoscope
              className="text-white"
              size={36}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-slate-800">
          MedAssist AI
        </h1>

        <p className="text-center text-gray-500 mt-2">
          AI Clinical Decision Support Platform
        </p>

        <h2 className="text-xl font-semibold text-center mt-8">
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>

            <label className="font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="doctor@example.com"
              className="w-full mt-2 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

          </div>

          {/* Password */}
          <div>

            <label className="font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="w-full mt-2 border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-5 text-gray-500"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {
                  showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                }
              </button>

            </div>

          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              <span className="text-sm">
                Remember Me
              </span>

            </label>

            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Error */}
          {
            error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
                {error}
              </div>
            )
          }

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-gray-500 mt-8">

          Don't have an account?

          <span className="text-blue-600 font-semibold cursor-pointer ml-2 hover:underline">
            Register
          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;
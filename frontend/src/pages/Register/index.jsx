import { useState } from "react";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { register as registerService } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerService({
        full_name: fullName,
        email: email,
        password: password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.detail ||
          "Registration failed. Please try again."
        );
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
          Create Account
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Full Name */}
          <div>
            <label className="font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Dr. John Doe"
              className="w-full mt-2 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                className="w-full mt-2 border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                required
                minLength={6}
              />

              <button
                type="button"
                className="absolute right-3 top-5 text-gray-500"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full mt-2 border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                required
                minLength={6}
              />

              <button
                type="button"
                className="absolute right-3 top-5 text-gray-500"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3">
              {success}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Back to Login */}
        <p className="text-center text-gray-500 mt-8">

          Already have an account?

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold ml-2 hover:underline"
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Register;
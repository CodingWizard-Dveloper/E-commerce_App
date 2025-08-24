import { Link } from "react-router-dom";
import { User, Mail, Lock, UserRoundPen, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, signup } from "../slice/auth.slice";

export default function Signup() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userName, email, password } = errors;

  const onSubmit = (data) => {
    dispatch(signup({ data }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account <User strokeWidth={2.75} className="inline ml-1" />
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label
              className={`block text-sm font-medium ${
                userName ? "text-red-600" : "text-gray-600"
              }`}
            >
              Name
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                userName ? "border-red-500" : "border-gray-300"
              }`}
            >
              <UserRoundPen
                className={`w-5 h-5 ${
                  userName ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("userName", { required: "userName is required" })}
              />
            </div>
            {userName && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {userName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium ${
                email ? "text-red-600" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                email ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail
                className={`w-5 h-5 ${
                  email ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {email && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium ${
                password ? "text-red-600" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                password ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Lock
                className={`w-5 h-5 ${
                  password ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {password && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {password.message}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition transform shadow-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, Handshake } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, login } from "../slice/auth.slice";

export default function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { email: emailError, password: passwordError } = errors;

  const onSubmit = async (data) => {
    dispatch(login({ data, callBack: ()=> dispatch(checkAuth()) }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back <Handshake className="inline" />
        </h2>

        {error && (
          <h3 className="text-xl font-bold text-red-500 mb-3"> {error} </h3>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium ${
                emailError ? "text-red-600" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 transition ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail
                className={`w-5 h-5 ${
                  emailError ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {emailError && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {emailError.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium ${
                passwordError ? "text-red-600" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 transition ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Lock
                className={`w-5 h-5 ${
                  passwordError ? "text-red-500" : "text-gray-400"
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
            {passwordError && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {passwordError.message}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition transform shadow-md"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

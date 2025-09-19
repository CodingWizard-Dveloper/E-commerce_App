import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, X, User2Icon, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changeUser, checkAuth, logout } from "../../slice/auth.slice";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";

const Settings = () => {
  const {
    user: defaultUser,
    error,
    success,
    loading,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [user, setUser] = useState({
    name: defaultUser?.userName,
    email: defaultUser?.email,
    avatar: defaultUser?.avatar,
    joined: defaultUser?.createdAt,
  });
  // Form for user profile information
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    watch: watchProfile,
    setValue: setValueProfile,
    formState: { errors: errorsProfile, isDirty: isDirtyProfile },
  } = useForm({
    defaultValues: {
      name: defaultUser?.userName || "",
      email: defaultUser?.email || "",
      avatar: defaultUser?.avatar || "",
    },
  });

  // Form for password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    defaultValues: {
      currentPass: "",
      newPass: "",
      confirmPass: "",
    },
  });

  const watchedProfileValues = watchProfile();
  const watchedPasswordValues = watchPassword();

  // Check if profile form is modified (including image changes)
  const isProfileFormModified = isDirtyProfile || imageChanged;

  const formattedDate = new Date(user.joined).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file
      setImageChanged(true); // Mark as changed
      const imageUrl = URL.createObjectURL(file);
      setValueProfile("avatar", imageUrl);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null); // Clear the file
    setImageChanged(true); // Mark as changed
    setValueProfile("avatar", "");
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("userName", data.name);
    formData.append("email", data.email);

    // Only append the file if a new one was selected
    formData.append("profileImage", selectedFile ?? user?.avatar);

    dispatch(
      changeUser({
        data: formData,
      })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (success) {
      toast.success("Profile edited");
    }
  }, [error, success]);

  const changePass = (data) => {
    const formData = new FormData();
    formData.append("currentPass", data.currentPass);
    formData.append("newPass", data.newPass);
    // Don't include profile image in password change

    dispatch(
      changeUser({
        data: formData,
      })
    );
  };

  if (loading.bool && !loading.full) {
    return <Loader message={loading.message} />;
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Profile Edit Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-lg font-semibold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmitProfile(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="flex items-end gap-4">
              <div className="relative group w-28 h-28">
                {watchedProfileValues?.avatar ? (
                  <img
                    src={
                      watchedProfileValues.avatar ||
                      "/profile/default-avatar.png"
                    }
                    className="h-28 w-28 rounded-full object-cover border-4 border-indigo-600 shadow"
                    loading="lazy"
                  />
                ) : (
                  <User2Icon
                    className="rounded-full object-cover border-4 border-indigo-600 shadow inline-block"
                    color="#4f39f6"
                    size={"112px"}
                  />
                )}
                {/* Camera overlay on hover */}
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {/* Remove button */}
              {watchedProfileValues.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  <X className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              {...registerProfile("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                errorsProfile.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
            />
            {errorsProfile.name && (
              <span className="text-red-500 text-xs mt-1">
                {errorsProfile.name.message}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              disabled
              {...registerProfile("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md bg-gray-100 cursor-not-allowed ${
                errorsProfile.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errorsProfile.email && (
              <span className="text-red-500 text-xs mt-1">
                {errorsProfile.email.message}
              </span>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Joined Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>

          {/* Save Button */}
          {isProfileFormModified && (
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
            >
              Save Changes
            </button>
          )}
        </form>
      </div>

      {/* Change Password & Logout Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-orange-600">
          Change Password
        </h3>

        <form
          onSubmit={handleSubmitPassword(changePass)}
          className="space-y-4 mb-6"
        >
          {/* Current Password Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              {...registerPassword("currentPass", {
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                errorsPassword.currentPass
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your current password"
            />
            {errorsPassword.currentPass && (
              <span className="text-red-500 text-xs mt-1">
                {errorsPassword.currentPass.message}
              </span>
            )}
          </div>

          {/* New Password Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              {...registerPassword("newPass", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                errorsPassword.newPass ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your new password"
            />
            {errorsPassword.newPass && (
              <span className="text-red-500 text-xs mt-1">
                {errorsPassword.newPass.message}
              </span>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              {...registerPassword("confirmPass", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watchedPasswordValues.newPass ||
                  "Passwords do not match",
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                errorsPassword.confirmPass
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Confirm your new password"
            />
            {errorsPassword.confirmPass && (
              <span className="text-red-500 text-xs mt-1">
                {errorsPassword.confirmPass.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-medium"
          >
            Change Password
          </button>
        </form>

        {/* Danger Zone */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-red-600">
            Danger Zone
          </h4>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit cursor-pointer"
            onClick={() => dispatch(logout())}
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

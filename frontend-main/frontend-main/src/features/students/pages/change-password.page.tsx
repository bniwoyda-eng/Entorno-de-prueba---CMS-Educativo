import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import csmApi from "../../../api/csm.api";
import { CustomAlert } from "../../../utils";
import { useAuthStore } from "../../auth/auth.store";

const passwordSchema = z
  .string()
  .nonempty({ message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .max(50, { message: "Password must be at most 50 characters" })
  .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must include at least one uppercase letter, one lowercase letter, and one number or special character.",
  });

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty({ message: "Password is required" }),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof updatePasswordSchema>;

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [viewCurrentPassword, setViewCurrentPassword] = useState(false);
  const [viewNewPassword, setViewNewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      if (!user) return;
      const email = user.email;
      const { currentPassword, newPassword } = values;
      setFormSubmitted(true);
      await csmApi.post("/api/change-password", {
        email,
        currentPassword,
        newPassword,
      });
      navigate("/");
      CustomAlert.toast("success", "Password changed successfully!");
    } catch (error) {
      reset();
      CustomAlert.toast(
        "error",
        "Unable to change password. Please try again."
      );
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex-1 grid place-items-center bg-white rounded-xl p-5">
        <div className="border border-gray-200 p-8 rounded-xl shadow-md max-w-[500px] w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5">
            Change Password
          </h1>
          <p className="text-graphite mb-5">
            Enter your current password and the new password to update your
            account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* Current password */}
            <div className="mb-4 relative">
              <label
                className="text-graphite font-semibold"
                htmlFor="currentPassword"
              >
                Current password
              </label>
              <input
                {...register("currentPassword")}
                type={viewCurrentPassword ? "text" : "password"}
                id="currentPassword"
                className="form-control mt-1"
                autoComplete="off"
                placeholder="Enter your current password"
              />
              {/* Botón para alternar la visibilidad */}
              <button
                type="button"
                className="absolute right-4 top-9 text-graphite"
                onClick={() => setViewCurrentPassword(!viewCurrentPassword)}
              >
                {viewCurrentPassword ? <EyeClosed /> : <Eye />}
              </button>
              {errors.currentPassword && (
                <span className="text-red-500 text-xs">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            {/* New password */}
            <div className="mb-4 relative">
              <label
                className="text-graphite font-semibold"
                htmlFor="newPassword"
              >
                New password
              </label>
              <input
                {...register("newPassword")}
                type={viewNewPassword ? "text" : "password"}
                id="newPassword"
                className="form-control mt-1"
                autoComplete="off"
                placeholder="Enter your new password"
              />
              {/* Botón para alternar la visibilidad */}
              <button
                type="button"
                className="absolute right-4 top-9 text-graphite"
                onClick={() => setViewNewPassword(!viewNewPassword)}
              >
                {viewNewPassword ? <EyeClosed /> : <Eye />}
              </button>
              {errors.newPassword && (
                <span className="text-red-500 text-xs">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm new password */}
            <div className="mb-4 relative">
              <label
                className="text-graphite font-semibold"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <input
                {...register("confirmPassword")}
                type={viewConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="form-control mt-1"
                autoComplete="off"
                placeholder="Confirm your new password"
              />
              {/* Botón para alternar la visibilidad */}
              <button
                type="button"
                className="absolute right-4 top-9 text-graphite"
                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
              >
                {viewConfirmPassword ? <EyeClosed /> : <Eye />}
              </button>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              className="btn btn-main w-full mb-4"
              type="submit"
              title="Change password"
              disabled={formSubmitted}
            >
              Change password
            </button>
            <button
              className="btn btn-link w-full"
              type="button"
              title="Return to log in"
              onClick={() => navigate("/students")}
              disabled={formSubmitted}
            >
              Return to dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

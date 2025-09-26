import { Fragment, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomAlert } from "../../../utils";
import { AuthService } from "../auth.service";
import { Eye, EyeClosed } from "lucide-react";

// Esquema para el campo de contraseña
const passwordSchema = z
  .string()
  .nonempty({ message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .max(50, { message: "Password must be at most 50 characters" })
  .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must include at least one uppercase letter, one lowercase letter, and one number or special character.",
  });

// Esquema para el formulario completo
const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Aplica el mensaje de error a confirmPassword
  });

type FormData = z.infer<typeof newPasswordSchema>;

export const RecoverPasswordPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      if (!token) return;
      setFormSubmitted(true);
      const { password } = values;
      await AuthService.recoverPassword({ newPassword: password, token });
      CustomAlert.toast("success", "Password updated successfully");
      navigate("/auth/login");
    } catch (error) {
      CustomAlert.toast("error", "Something went wrong. Please try again.");
    } finally {
      reset();
      setFormSubmitted(false);
    }
  };

  return (
    <Fragment>
      <h2 className="text-graphite text-xl font-medium">Reset password</h2>
      <small className="text-graphite text-center font-medium">
        Choose a new password with at least 8 characteres, uncluding a
        combination og letters, numbers and symbols.
      </small>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4 relative">
          <label className="text-graphite" htmlFor="password">
            New password
          </label>
          <input
            {...register("password")}
            type={viewPassword ? "text" : "password"}
            id="password"
            className="form-control mt-1"
            autoComplete="off"
            placeholder="Enter your new password"
          />
          {/* Botón para alternar la visibilidad */}
          <button
            type="button"
            className="absolute right-4 top-9 text-graphite"
            onClick={() => setViewPassword(!viewPassword)}
          >
            {viewPassword ? (
              <EyeClosed className="w-5" />
            ) : (
              <Eye className="w-5" />
            )}
          </button>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="text-graphite" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            {...register("confirmPassword")}
            type={viewConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className="form-control mt-1"
            autoComplete="off"
            placeholder="Enter your new password again"
          />
          {/* Botón para alternar la visibilidad */}
          <button
            type="button"
            className="absolute right-4 top-9 text-graphite"
            onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
          >
            {viewConfirmPassword ? (
              <EyeClosed className="w-5" />
            ) : (
              <Eye className="w-5" />
            )}
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
          title="Confirm"
          disabled={formSubmitted}
        >
          Confirm
        </button>
        <button
          className="btn btn-link w-full"
          type="button"
          title="Return to log in"
          onClick={() => navigate("/auth/login")}
          disabled={formSubmitted}
        >
          Return to log in
        </button>
      </form>
    </Fragment>
  );
};

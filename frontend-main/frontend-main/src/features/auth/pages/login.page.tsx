import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../auth.store";
import { getRedirectPathByRole, CustomAlert } from "../../../utils";
import { Eye, EyeClosed } from "lucide-react";

const loginSchema = z.object({
  email: z.string().nonempty({ message: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: z.string().nonempty({ message: "Password is required" }),
});

type FormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [viewPassword, setViewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (dataLogin: FormData) => {
    try {
      const user = await login(dataLogin.email, dataLogin.password);
      if (!user) {
        CustomAlert.toast("error", "Invalid credentials");
        return;
      }
      const redirectPath = getRedirectPathByRole(user.roles[0]);
      navigate(redirectPath);
    } catch (error) {
      reset();
      CustomAlert.toast("error", "Unable to login. Please try again.");
    }
  };

  return (
    <Fragment>
      <h2 className="text-graphite text-xl font-medium">
        Log In to your account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <label className="text-graphite" htmlFor="email">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            name="email"
            className="form-control mt-1"
            autoComplete="off"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="text-graphite" htmlFor="password">
            Password
          </label>
          <input
            {...register("password")}
            type={viewPassword ? "text" : "password"}
            id="password"
            className="form-control mt-1"
            autoComplete="off"
            placeholder="Enter your password"
          />
          {/* Botón para alternar la visibilidad */}
          <button
            type="button"
            className="absolute right-4 top-9 text-graphite"
            onClick={() => setViewPassword(!viewPassword)}
          >
            {viewPassword ? <EyeClosed /> : <Eye />}
          </button>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          className="btn btn-main w-full mb-4"
          type="submit"
          title="Log In"
        >
          Log In
        </button>
        <button
          className="btn btn-link w-full"
          type="button"
          title="Forgot your password?"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot your password?
        </button>
      </form>
    </Fragment>
  );
};

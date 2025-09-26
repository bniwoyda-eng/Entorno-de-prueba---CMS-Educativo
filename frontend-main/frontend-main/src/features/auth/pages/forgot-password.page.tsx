import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomAlert } from "../../../utils";
import { AuthService } from "../auth.service";

const emailSchema = z.object({
  email: z.string().nonempty({ message: "Email is required" }).email({
    message: "Invalid email",
  }),
});

type FormData = z.infer<typeof emailSchema>;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hiddenEmail, setHiddenEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      const { email } = values;
      AuthService.requestPasswordRecovery(email);
      setHiddenEmail(email.replace(/(?<=.{1}).(?=[^@]*?.@)/g, "*"));
      setFormSubmitted(true);
      reset();
    } catch (error) {
      setHiddenEmail("");
      setFormSubmitted(false);
      reset();
      CustomAlert.toast("error", "Something went wrong. Please try again.");
    }
  };

  return (
    <Fragment>
      {!formSubmitted ? (
        <>
          <h2 className="text-graphite text-xl font-medium">
            Forgot password?
          </h2>
          <small className="text-graphite text-center font-medium">
            Enter your mail, and we’ll send you a link to reset it securely.
          </small>
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
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              className="btn btn-main w-full mb-4"
              type="submit"
              title="Confirm"
            >
              Confirm
            </button>
            <button
              className="btn btn-link w-full"
              type="button"
              title="Return to log in"
              onClick={() => navigate("/auth/login")}
            >
              Return to log in
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col gap-5 text-graphite text-center font-medium">
          <h2 className="text-xl">Check your inbox</h2>
          <small>
            If there is an account associated with{" "}
            <strong>{hiddenEmail}</strong>, you will receive an email with a
            link to reset your password. Please check your spam folder if you
            don’t see it.
          </small>
          <button className="text-xs" onClick={() => setFormSubmitted(false)}>
            Email not received? Try again
          </button>
        </div>
      )}
    </Fragment>
  );
};

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { ApiBasic } from "../../_utils/axios";
import { toast } from 'react-toastify';


export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "" } = location.state || {}; 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = (e) => {
    event.preventDefault();
    if(isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const credentials = Object.fromEntries(formData.entries()); // Converts FormData to

        ApiBasic.post('/api/request-password-reset', credentials, {
        }).then((response) => {
            // navigate("/signin");
            const { message, success  } = response?.data || {};
            if(success)
              toast.success(message, { position: "bottom-right", onClose: () => navigate("/signin") });
            else
              toast.error(message, { position: "bottom-right" ,});
        }).catch((error) => {
            toast.error(error.response?.data?.message || "Reset Password Error!", { position: "bottom-right" });
        }).finally(() => setIsSubmitting(false));
  };


  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to signin
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Forgot your password? Enter your email and we’ll send you a reset link.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
              </div>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" type="email" isRequired={true} defaultValue={email} />
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signin"
                  className="text-green-500 hover:text-green-600 dark:text-green-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

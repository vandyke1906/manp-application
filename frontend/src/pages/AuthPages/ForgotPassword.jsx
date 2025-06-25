import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <>
      <PageMeta title="MANP - Forgot Password" />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  )
}

export default ForgotPassword

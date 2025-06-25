import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <>
      <PageMeta title="MANP - Reset Password" />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  )
}

export default ResetPassword

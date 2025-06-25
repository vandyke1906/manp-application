import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import VerificationForm from "../../components/auth/VerificationForm";

const Verification = () => {
  return (
    <>
      <PageMeta title="MANP - Verificaion" />
      <AuthLayout>
        <VerificationForm />
      </AuthLayout>
    </>
  )
}

export default Verification

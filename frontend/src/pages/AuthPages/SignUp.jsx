import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <>
      <PageMeta title="SignUp"/>
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  )
}

export default SignUp

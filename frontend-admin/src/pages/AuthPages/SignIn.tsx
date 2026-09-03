import SignInForm from "../../components/auth/SignInForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SignIn | Admin Helpdesk KKP"
        description="Halaman signIn admin helpdesk Kementerian Kelautan dan Perikanan"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

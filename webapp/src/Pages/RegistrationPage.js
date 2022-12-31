import RegistrationForm from "../components/Auth/RegistrationForm";
import AuthFormWrapper from "../components/Layout/AuthFormWrapper";

function RegistrationPage() {
  return (
    <AuthFormWrapper title={"Registration"}>
      <RegistrationForm />
    </AuthFormWrapper>
  );
}

export default RegistrationPage;

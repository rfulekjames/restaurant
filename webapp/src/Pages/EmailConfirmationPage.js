import AuthFormWrapper from "../components/Layout/AuthFormWrapper";

function EmailConfirmationPage(props) {
    return (
        <AuthFormWrapper title={"Email Confirmation Required"}>
            <div>Go and see your email inbox to continue in peace OR ELSE YOUR R's are SCREWED.</div>
        </AuthFormWrapper>
    );
}

export default EmailConfirmationPage;

import SignInPage from "../components/signin";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <SignInPage />
      </div>
    </div>
  );
}

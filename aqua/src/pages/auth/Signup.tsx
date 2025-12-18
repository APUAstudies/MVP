import AuthForm from "../../components/ui/AuthForm";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col items-center gap-4">
        <AuthForm mode="signup" />
        <p className="text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
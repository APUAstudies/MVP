import AuthForm from "../../components/ui/AuthForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col items-center gap-4">
        <AuthForm mode="login" />
        <p className="text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--primary)] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
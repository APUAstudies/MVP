import { useState } from "react";
import { signIn, signUp } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);

      // Redirect after success
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-80 p-6 bg-[var(--bg-sidebar-icon)] border border-[var(--border-color)] rounded-xl shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-center text-[var(--text-main)]">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] focus:border-[var(--primary)] outline-none transition-colors placeholder:text-[var(--text-muted)]"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md text-[var(--text-main)] focus:border-[var(--primary)] outline-none transition-colors placeholder:text-[var(--text-muted)]"
        required
      />
      <button
        type="submit"
        className="bg-[var(--primary)] text-black font-bold py-2 px-4 rounded-md hover:opacity-90 transition-all active:scale-[0.98]"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
      {error && <p className="text-rose-500 text-xs text-center">{error}</p>}
    </form>
  );
}
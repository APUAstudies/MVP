import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	if (loading) return <p className="p-8">Loading...</p>;

	return (
		<div className="p-8">
			{user ? (
				<>
					<p>Welcome, {user.email}</p><br/>
					<h1>THIS IS THE DASHBOARD</h1>
					<button
						onClick={async () => {
							await signOut();
							navigate("/login");
						}}
						className="bg-red-500 text-white px-4 py-2 rounded mt-2"
					>
						Sign Out
					</button>
				</>
			) : (
				<p>Please log in to access the study lobbies and tools.</p>
			)}
		</div>
	);
}
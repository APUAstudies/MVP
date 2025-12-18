import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StudyLobby from "./pages/Lobby";
import { Tools } from "./pages/Tools";
import { ToolsList } from "./pages/dashboard/tools/ToolsList";
import Settings from "./pages/Settings";
import { DashboardLayout } from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lobby" element={<StudyLobby />} />

          {/* <Route path="/tools" element={<Tools />}>
            <Route index element={<ToolsList type="favorites" title="Featured Tools" />} />
            <Route path="extensions" element={<ToolsList type="extensions" title="Chrome Extensions" />} />
            <Route path="websites" element={<ToolsList type="websites" title="Useful Websites" />} />
            <Route path="custom" element={<ToolsList type="custom" title="Our Custom Tools" />} />
            <Route path="suggest" element={<div className="p-6 text-white">Suggestion Form Coming Soon!</div>} />
          </Route> */}
          <Route path="/tools" element={<Tools />}>
            <Route index element={<ToolsList type="favorites" title="Featured Tools" />} />
            <Route path="extensions" element={<ToolsList type="extensions" title="Chrome Extensions" />} />
            <Route path="websites" element={<ToolsList type="websites" title="Useful Websites" />} />
            <Route path="custom" element={<ToolsList type="custom" title="Our Tools" />} />
            <Route path="suggest" element={<ToolsList type="suggest" title="Suggest a Tool" />} />
          </Route>

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./pages/dashboard/Dashboard";
import { DashboardLayout } from "./components/layout/DashboardLayout";

import StudyLobby from "./pages/dashboard/lobby/Lobby";

import { Tools } from "./pages/dashboard/tools/Tools";
import { ToolsList } from "./pages/dashboard/tools/ToolsList";

import Settings from "./pages/dashboard/settings/Settings";
import { ProfileSettings } from "./pages/dashboard/settings/ProfileSettings";
import { AccountSettings } from "./pages/dashboard/settings/AccountSettings";
import { AppearanceSettings } from "./pages/dashboard/settings/AppearanceSettings";
import { ConnectSettings } from "./pages/dashboard/settings/ConnectSettings";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* lobby */}
          <Route path="/lobby" element={<StudyLobby />}>
            <Route index element={<div className="p-6 text-white">Main Study Room</div>} />
            <Route path="help" element={<div className="p-6 text-white">Getting started</div>} />
            <Route path="groups" element={<div className="p-6 text-white">Groups</div>} />
          </Route>

          {/* tools */}
          <Route path="/tools" element={<Tools />}>
            <Route index element={<ToolsList type="favorites" title="Featured Tools" />} />
            <Route path="extensions" element={<ToolsList type="extensions" title="Chrome Extensions" />} />
            <Route path="websites" element={<ToolsList type="websites" title="Useful Websites" />} />
            <Route path="custom" element={<ToolsList type="custom" title="Our Tools" />} />
            <Route path="suggest" element={<ToolsList type="suggest" title="Suggest a Tool" />} />
          </Route>

          {/* settings */}
          <Route path="/settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="customization" element={<AppearanceSettings />} />
            <Route path="connect" element={<ConnectSettings />} />
          </Route>
          
        </Route>
      </Routes>
    </Router>
  );
}

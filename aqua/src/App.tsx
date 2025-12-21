import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./pages/dashboard/Dashboard";
import { DashboardLayout } from "./components/layout/DashboardLayout";

import StudyNotebook from "./pages/dashboard/lobby/Notebook";
import { NotebookPage, NotebookHelp, NotebookHome } from "./pages/dashboard/lobby/NotebookViews";


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

          {/* notebook */}
          <Route path="/notebook" element={<StudyNotebook />}>
            <Route index element={<NotebookHome />} />
            <Route path="help" element={<NotebookHelp />} />
            <Route path="p/:pagename" element={<NotebookPage />} /> 
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

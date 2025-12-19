import { Outlet, NavLink } from "react-router-dom";

export default function Settings() {
  const navItems = [
    { label: "Profile", path: "/settings" },
    { label: "Account", path: "/settings/account" },
    { label: "Appearance", path: "/settings/customization" },
    { label: "Connect", path: "/settings/connect" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 mt-6 px-6">
      <h1 className="text-2xl font-bold text-[var(--text-main)]">Settings</h1>

      <div className="flex gap-1 border-b border-[var(--border-color)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/settings"}
            className={({ isActive }) => 
              `px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                isActive 
                  ? "border-[var(--primary)] text-[var(--primary)]" 
                  : "border-transparent text-[var(--text-muted)] hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
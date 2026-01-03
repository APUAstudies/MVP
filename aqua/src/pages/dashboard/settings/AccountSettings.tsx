export const AccountSettings = () => {

  return (
    <div className="space-y-8">
      <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Security</h2>
        <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-[11px] text-[var(--text-muted)]">Last changed 3 months ago</p>
          </div>
          <button className="text-xs text-[var(--primary)] font-bold hover:underline">Change password</button>
        </div>
        <div className="flex justify-between items-center py-3">
          <div>
            <p className="text-sm font-medium">Two-factor Authentication</p>
            <p className="text-[11px] text-[var(--text-muted)]">Add an extra layer of security to your account.</p>
          </div>
          <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-2 h-2 bg-[var(--text-muted)] rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
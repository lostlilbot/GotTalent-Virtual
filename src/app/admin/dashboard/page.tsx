import { redirect } from "next/navigation";
import { getCurrentAdmin, logoutAdmin, ensureDefaultAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
  // Ensure default admin exists
  await ensureDefaultAdmin();
  
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const handleLogout = async () => {
    "use server";
    await logoutAdmin();
    redirect("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="bg-neutral-800/50 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">
              Welcome, {admin.name} ({admin.role})
            </span>
            <form action={handleLogout}>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Submissions</h2>
            <p className="text-neutral-400 mb-4">Manage talent submissions</p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              View Submissions
            </button>
          </div>

          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Judges</h2>
            <p className="text-neutral-400 mb-4">Manage judge accounts</p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Manage Judges
            </button>
          </div>

          <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-neutral-400 mb-4">Platform settings</p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

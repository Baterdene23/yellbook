import { requireAdminSession } from "@/lib/server-auth";

export default async function AdminDashboard() {
  const session = await requireAdminSession();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          Welcome, {session?.user?.name || (session?.user as any)?.email}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Admin Panel</div>
          <div className="text-3xl font-bold">Ready</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="block p-4 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-center transition"
          >
            <div className="font-semibold mb-1">👥 Manage Users</div>
            <div className="text-sm text-gray-400">View and manage users</div>
          </a>
        </div>
      </div>
    </div>
  );
}

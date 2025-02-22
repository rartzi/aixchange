import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/users');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdminNav />
      <main className="w-full px-4 py-6 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
}
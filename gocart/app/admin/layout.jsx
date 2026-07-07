import { Show, SignIn } from "@clerk/nextjs";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "GoCart. - Admin",
  description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <Show
      when="signed-in"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <SignIn fallbackRedirectUrl="/admin" routing="hash" />
        </div>
      }
    >
      <AdminLayout>
        {children}
      </AdminLayout>
    </Show>
  );
}
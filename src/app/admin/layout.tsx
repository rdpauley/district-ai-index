import { AdminTopbar } from "./AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminTopbar />
      {children}
    </>
  );
}

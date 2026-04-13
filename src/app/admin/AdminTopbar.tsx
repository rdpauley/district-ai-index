"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on the login page itself
  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Admin Console
        </span>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-charcoal-light hover:bg-navy-50 hover:text-navy transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
        </button>
      </div>
    </div>
  );
}

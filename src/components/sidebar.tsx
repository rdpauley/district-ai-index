"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  GitCompareArrows,
  ShieldCheck,
  CreditCard,
  SendHorizonal,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/directory", label: "Directory", icon: Library },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/verified", label: "Verified", icon: ShieldCheck },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/submit", label: "Submit Tool", icon: SendHorizonal },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-navy-700/50 bg-navy-950 transition-all duration-300 flex flex-col",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-700/50">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric text-white font-bold text-sm">
              AI
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">
              District AI Index
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric text-white font-bold text-sm">
              AI
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-electric/15 text-electric-glow"
                  : "text-slate-400 hover:bg-navy-800 hover:text-slate-200"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-navy-700/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-navy-800 hover:text-slate-300 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

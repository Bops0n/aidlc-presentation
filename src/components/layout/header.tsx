"use client";

import { useSession, signOut } from "next-auth/react";
import { Dropdown } from "@/components/ui/dropdown";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold">Presentation Builder</h1>
      
      {session?.user && (
        <Dropdown
          trigger={
            <div className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm">{session.user.name || session.user.email}</span>
            </div>
          }
          items={[
            { label: "Sign Out", onClick: () => signOut({ callbackUrl: "/login" }), danger: true },
          ]}
        />
      )}
    </header>
  );
}

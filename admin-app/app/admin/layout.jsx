"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLogin = localStorage.getItem("adminLogin");

    if (!isLogin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}

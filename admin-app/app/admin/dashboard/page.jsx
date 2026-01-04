"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/admin/login");
      }
    };

    checkAdmin();
  }, [router]);

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/admin/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

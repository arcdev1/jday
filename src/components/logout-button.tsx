"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useCallback } from "react";
import { logout } from "~/use-cases/client/logout";

export default function LogoutButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const router = useRouter();
  const onClickLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [router]);
  return (
    <button
      {...props}
      className="bg-blue-600 text-white px-2 py-1 rounded"
      onClick={onClickLogout}
    >
      Logout
    </button>
  );
}

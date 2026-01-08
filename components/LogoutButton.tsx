"use client";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button variant="ghost" onClick={() => logout()}>
      Log Out
    </Button>
  );
}

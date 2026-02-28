"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/button";

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(
    async (_: { error?: string } | null, formData: FormData) => {
      const result = await loginAction(formData);
      return result ?? null;
    },
    null as { error?: string } | null
  );

  return (
    <div dir="ltr" className="flex min-h-screen items-center justify-center bg-background px-4" lang="en">
      <form action={formAction} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Admin login</h1>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </div>
  );
}

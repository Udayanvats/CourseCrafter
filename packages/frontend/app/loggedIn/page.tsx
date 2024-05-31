"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function LoggedInComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    async function loginWithGoogle() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          cache: "no-store",
          credentials: "include",
        }
      );

      if (res.ok) {
        console.log("logged in");
        router.replace("/");
        router.refresh();
      } else {
        console.error("Failed to log in");
        // Handle error here, e.g., show a message to the user
      }
    }

    if (code) {
      loginWithGoogle();
    }
  }, [searchParams, router]);

  return (
    <div>
      <h1>Logged In</h1>
    </div>
  );
}

export default function LoggedIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoggedInComponent />
    </Suspense>
  );
}

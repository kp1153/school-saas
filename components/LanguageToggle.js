// components/LanguageToggle.js

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageToggle({ locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const newLocale = locale === "hi" ? "en" : "hi";
    startTransition(async () => {
      await fetch("/api/set-locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
    >
      {isPending ? "..." : locale === "hi" ? "EN" : "हिं"}
    </button>
  );
}
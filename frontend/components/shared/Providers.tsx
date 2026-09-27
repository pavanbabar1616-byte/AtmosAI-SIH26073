"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              border: "1px solid #262626",
              background: "#0f0f0f",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { findUser } from "@/lib/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const user = findUser(email);
      if (!user || user.password !== password) {
        toast.error("Invalid email or password");
        return;
      }
      login({ id: user.id, name: user.name, email: user.email, role: user.role });
      toast.success(`Welcome back, ${user.name}!`);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    login({
      id: "demo-operator",
      name: "Demo Operator",
      email: "demo@atmosai.in",
      role: "Senior Meteorologist",
    });
    toast.success("Signed in as Demo Operator");
    router.push("/dashboard");
  };

  return (
    <div className="panel p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size={64} showText={false} />
        </div>
        <h1 className="text-2xl font-serif font-bold mb-1">AtmosAI Command</h1>
        <p className="micro-label">Secure Access Terminal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="micro-label mb-2 block">Operator Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@imd.gov.in"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="micro-label mb-2 block">Access Code</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Authenticating...
            </>
          ) : (
            "Authenticate"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 micro-label">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full border-amber-600/40 hover:bg-amber-600/10"
        onClick={demoLogin}
      >
        Continue as Demo Operator
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        New operator?{" "}
        <Link href="/signup" className="text-amber-500 hover:underline font-medium">
          Register access
        </Link>
      </p>
    </div>
  );
}
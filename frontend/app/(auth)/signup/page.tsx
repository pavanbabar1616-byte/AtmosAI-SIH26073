"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { createUser, findUser, validateEmail, validatePassword } from "@/lib/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!validateEmail(email)) return toast.error("Invalid email");
    const pw = validatePassword(password);
    if (!pw.valid) return toast.error(pw.error!);
    if (findUser(email)) return toast.error("Operator already registered");

    setLoading(true);
    try {
      const user = createUser(name.trim(), email.trim(), password);
      login(user);
      toast.success("Access granted. Welcome to AtmosAI.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size={64} showText={false} />
        </div>
        <h1 className="text-2xl font-serif font-bold mb-1">Register Operator</h1>
        <p className="micro-label">New Access Request</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="micro-label mb-2 block">Operator Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="micro-label mb-2 block">Email Address</label>
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
              placeholder="At least 6 characters"
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
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Registering...
            </>
          ) : (
            "Create Access"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already registered?{" "}
        <Link href="/signin" className="text-amber-500 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
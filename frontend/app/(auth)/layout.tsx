export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden grid-pattern">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-amber-700/5 rounded-full blur-3xl" />
      <div className="w-full max-w-md px-6 relative z-10">{children}</div>
    </div>
  );
}
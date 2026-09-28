import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso do administrador — CORRES DO ZK" },
      { name: "description", content: "Área restrita para gerenciar o catálogo da CORRES DO ZK." },
      { property: "og:title", content: "Acesso do administrador — CORRES DO ZK" },
      { property: "og:description", content: "Área restrita para gerenciar o catálogo da CORRES DO ZK." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: user } = await supabase.auth.getUser();
        const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.user?.id ?? "", _role: "admin" });
        if (!isAdmin) { await supabase.auth.signOut(); throw new Error("Esta conta não tem acesso ao painel."); }
        toast.success("Bem-vindo de volta.");
        void navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada. Confirme o e-mail que enviamos para entrar.");
        setMode("login");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível continuar.";
      toast.error(message === "Invalid login credentials" ? "E-mail ou senha incorretos." : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#090909] px-4 py-16 text-white">
      <div className="w-full max-w-md border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <p className="zk-eyebrow text-primary">Área restrita</p>
        <h1 className="zk-title mt-3 text-4xl">{mode === "login" ? "Entrar no painel" : "Criar acesso"}</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">
          {mode === "login"
            ? "Use o e-mail e a senha do administrador da loja."
            : "Crie a conta do administrador. A primeira conta criada recebe acesso total ao painel."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12" />
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-none text-[11px] font-black uppercase tracking-[0.18em]">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="zk-focus mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white"
        >
          {mode === "login" ? "Ainda não tenho acesso" : "Já tenho acesso"}
        </button>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — CORRES DO ZK" },
      { name: "description", content: "Fale com a CORRES DO ZK sobre pedidos, trocas e parcerias." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sending, setSending] = useState(false);

  return (
    <div className="min-h-[75vh]">
      <section className="border-b border-border bg-card/25">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <p className="zk-eyebrow text-primary">Fala com a gente</p>
          <h1 className="zk-title mt-3 text-7xl sm:text-8xl">Contato</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">Pedidos, trocas, parcerias e multimarcas. Respondemos em até 1 dia útil.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-8">
          <div><Mail className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4">E-mail</p><p className="mt-2 text-sm">contato@corresdozk.com</p></div>
          <div><p className="zk-eyebrow">Social</p><p className="mt-2 text-sm text-muted-foreground">@corresdozk — Instagram / TikTok</p></div>
        </div>
        <form
          className="zk-surface space-y-5 rounded-sm p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              (e.target as HTMLFormElement).reset();
              toast.success("Mensagem enviada", { description: "A equipe responde em breve." });
            }, 600);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" required placeholder="Seu nome" /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" required placeholder="voce@email.com" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="msg">Mensagem</Label><Textarea id="msg" name="msg" required rows={7} placeholder="Como podemos ajudar?" /></div>
          <Button type="submit" size="lg" disabled={sending} className="h-12 px-6 text-xs font-bold uppercase tracking-[0.16em]">{sending ? "Enviando..." : "Enviar mensagem"}<ArrowRight className="ml-2 h-4 w-4" /></Button>
        </form>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — CORRES DO ZK" },
      {
        name: "description",
        content:
          "Fale com a CORRES DO ZK sobre pedidos, trocas, parcerias e lojas multimarca.",
      },
      { property: "og:title", content: "Contato — CORRES DO ZK" },
      {
        property: "og:description",
        content: "Pedidos, trocas e parcerias com a CORRES DO ZK.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sending, setSending] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="zk-eyebrow">Fala com a gente</p>
      <h1 className="zk-title mt-3 text-5xl">Contato</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Pedidos, trocas, parcerias e multimarcas. Respondemos em até 1 dia útil.
      </p>

      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSending(true);
          setTimeout(() => {
            setSending(false);
            (e.target as HTMLFormElement).reset();
            toast.success("Mensagem enviada", {
              description: "A equipe responde em breve.",
            });
          }, 600);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" name="nome" required placeholder="Seu nome" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="voce@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="msg">Mensagem</Label>
          <Textarea id="msg" name="msg" required rows={5} placeholder="Como podemos ajudar?" />
        </div>
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </form>
    </div>
  );
}

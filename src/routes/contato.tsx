import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle, Play, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — CORRES DO ZK" },
      { name: "description", content: "Fale com a CORRES DO ZK pelo WhatsApp ou redes sociais." },
      { property: "og:title", content: "Contato — CORRES DO ZK" },
      { property: "og:description", content: "Fale com a CORRES DO ZK pelo WhatsApp ou redes sociais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contato,
});

const WHATSAPP_URL = "https://wa.me/5518997087679";

function Contato() {
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nome = String(data.get("nome") ?? "").trim();
    const contato = String(data.get("contato") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();
    const text = ["Olá, CORRES DO ZK!", `Nome: ${nome}`, `Contato: ${contato}`, "", mensagem].join("\n");
    setSending(true);
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setSending(false), 700);
  }

  return (
    <div className="min-h-[75vh] bg-[#090909] text-white">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#111,#090909)]">
        <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <p className="zk-eyebrow text-primary">Fala com a gente</p>
          <h1 className="zk-title mt-3 text-6xl sm:text-8xl">Contato</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/50">Use o WhatsApp para pedidos, dúvidas e atendimento.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
        <div className="space-y-4">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="zk-focus flex items-center gap-4 border border-white/10 bg-white/[0.025] p-5 transition hover:border-primary/60">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div><p className="text-xs font-black uppercase tracking-[0.12em]">WhatsApp</p><p className="mt-1 text-sm text-white/45">+55 18 99708-7679</p></div>
          </a>
          <a href="https://www.instagram.com/corresdozk/" target="_blank" rel="noreferrer" className="zk-focus flex items-center gap-4 border border-white/10 bg-white/[0.025] p-5 transition hover:border-primary/60">
            <Instagram className="h-5 w-5 text-primary" />
            <div><p className="text-xs font-black uppercase tracking-[0.12em]">Instagram</p><p className="mt-1 text-sm text-white/45">@corresdozk</p></div>
          </a>
          <a href="https://www.tiktok.com/@corresdozk" target="_blank" rel="noreferrer" className="zk-focus flex items-center gap-4 border border-white/10 bg-white/[0.025] p-5 transition hover:border-primary/60">
            <Play className="h-5 w-5 text-primary" />
            <div><p className="text-xs font-black uppercase tracking-[0.12em]">TikTok</p><p className="mt-1 text-sm text-white/45">@corresdozk</p></div>
          </a>
        </div>

        <form className="border border-white/10 bg-white/[0.025] p-6 sm:p-8" onSubmit={handleSubmit}>
          <p className="zk-eyebrow text-primary">Mensagem direta</p>
          <h2 className="zk-title mt-3 text-4xl">Abrir conversa no WhatsApp</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" required placeholder="Seu nome" /></div>
            <div className="space-y-2"><Label htmlFor="contato">Seu contato</Label><Input id="contato" name="contato" required placeholder="Telefone ou @" /></div>
          </div>
          <div className="mt-5 space-y-2"><Label htmlFor="mensagem">Mensagem</Label><Textarea id="mensagem" name="mensagem" required rows={7} placeholder="Como podemos ajudar?" /></div>
          <Button type="submit" size="lg" disabled={sending} className="mt-5 h-12 rounded-none px-6 text-xs font-black uppercase tracking-[0.16em]">{sending ? "Abrindo..." : "Enviar pelo WhatsApp"}<Send className="ml-2 h-4 w-4" /></Button>
        </form>
      </section>
    </div>
  );
}

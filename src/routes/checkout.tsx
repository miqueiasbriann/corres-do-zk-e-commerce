import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBRL } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalização — CORRES DO ZK" },
      { name: "description", content: "Confira seus dados e envie o pedido para confirmação pelo WhatsApp." },
    ],
  }),
  component: Checkout,
});

const WHATSAPP_NUMBER = "5518997087679";

function Checkout() {
  const { items, total } = useCart();
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? "").trim();

    const lines = [
      "Olá, CORRES DO ZK! Quero finalizar meu pedido.",
      "",
      "DADOS DO CLIENTE",
      `Nome: ${get("nome")}`,
      `Telefone: ${get("telefone")}`,
      `CEP: ${get("cep")}`,
      `Endereço: ${get("endereco")}, ${get("numero")}`,
      `Complemento: ${get("complemento") || "Não informado"}`,
      `Bairro: ${get("bairro")}`,
      `Cidade/UF: ${get("cidade")}`,
      `Forma de pagamento pretendida: ${get("pagamento")}`,
      "",
      "PRODUTOS",
      ...items.map(
        (item) =>
          `- ${item.name} | Tamanho: ${item.size} | Cor: não informada no catálogo | Quantidade: ${item.qty} | ${formatBRL(item.price * item.qty)}`,
      ),
      "",
      `Subtotal: ${formatBRL(total)}`,
      "Frete e pagamento serão confirmados pelo WhatsApp.",
      "Este pedido não está pago.",
    ];

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    setSending(true);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setSending(false), 700);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="zk-eyebrow text-primary">Finalização</p>
        <h1 className="zk-title mt-3 text-5xl sm:text-6xl">Sua sacola está vazia.</h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
          Adicione uma peça à sacola para preencher seus dados e enviar o pedido pelo WhatsApp.
        </p>
        <Button asChild className="mt-8 h-12 px-6 text-xs font-bold uppercase tracking-[0.16em]">
          <Link to="/loja">Voltar para a coleção</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14">
      <Link to="/loja" className="zk-focus inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Continuar comprando
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <form onSubmit={handleSubmit} className="zk-surface rounded-sm p-5 sm:p-8">
          <div className="border-b border-border pb-6">
            <p className="zk-eyebrow text-primary">1 / Seus dados</p>
            <h1 className="zk-title mt-3 text-5xl sm:text-6xl">Finalizar pedido</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              Preencha os dados abaixo. O pedido será enviado ao WhatsApp para confirmação de frete e pagamento.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" name="nome" required autoComplete="name" placeholder="Seu nome completo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" required autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" />
            </div>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" name="cep" required autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" required autoComplete="street-address" placeholder="Rua, avenida..." />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" name="numero" required inputMode="numeric" placeholder="123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento (opcional)</Label>
                <Input id="complemento" name="complemento" autoComplete="address-line2" placeholder="Apto, bloco..." />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" name="bairro" required autoComplete="address-level3" placeholder="Seu bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade/UF</Label>
                <Input id="cidade" name="cidade" required autoComplete="address-level2" placeholder="Cidade - UF" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pagamento">Forma de pagamento pretendida</Label>
              <Input id="pagamento" name="pagamento" required placeholder="Ex.: Pix, cartão..." />
              <p className="text-xs text-muted-foreground">A forma de pagamento será confirmada pelo WhatsApp.</p>
            </div>

            <Button type="submit" size="lg" disabled={sending} className="h-14 w-full text-xs font-bold uppercase tracking-[0.16em]">
              <MessageCircle className="mr-2 h-4 w-4" />
              {sending ? "Abrindo WhatsApp..." : "Finalizar pelo WhatsApp"}
            </Button>
          </div>
        </form>

        <aside className="zk-surface rounded-sm p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="zk-eyebrow text-primary">2 / Resumo</p>
          <h2 className="zk-title mt-3 text-3xl">Seu pedido</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}`} className="flex gap-3 border-b border-border pb-4">
                <img src={item.image} alt="" loading="lazy" className="h-20 w-16 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tam. {item.size} · Qtd. {item.qty} · Cor não informada
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatBRL(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
            <span className="zk-eyebrow">Subtotal</span>
            <span className="zk-title text-3xl">{formatBRL(total)}</span>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Frete e pagamento serão confirmados pelo WhatsApp. O envio desta solicitação não significa pagamento concluído.
          </p>
        </aside>
      </div>
    </div>
  );
}

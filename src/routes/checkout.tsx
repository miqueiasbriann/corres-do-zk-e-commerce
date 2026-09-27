import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Tag } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBRL, storeConfig, type Coupon } from "@/data/products";
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

const WHATSAPP_URL = `https://wa.me/${storeConfig.whatsappNumber}`;

type FieldName =
  | "nome"
  | "telefone"
  | "cep"
  | "endereco"
  | "numero"
  | "bairro"
  | "cidade"
  | "estado"
  | "pagamento";

type FormErrors = Partial<Record<FieldName, string>>;

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function validateField(name: FieldName, value: string): string | undefined {
  const clean = value.trim();
  if (name === "nome" && clean.split(/\s+/).filter(Boolean).length < 2) return "Informe nome e sobrenome.";
  if (name === "telefone" && !/^\d{10,11}$/.test(digits(clean))) return "Informe um telefone com DDD.";
  if (name === "cep" && !/^\d{8}$/.test(digits(clean))) return "Informe um CEP com 8 dígitos.";
  if (name === "endereco" && clean.length < 3) return "Informe a rua, avenida ou logradouro.";
  if (name === "numero" && clean.length < 1) return "Informe o número do endereço.";
  if (name === "bairro" && clean.length < 2) return "Informe o bairro.";
  if (name === "cidade" && clean.length < 2) return "Informe a cidade.";
  if (name === "estado" && !/^[A-Za-z]{2}$/.test(clean)) return "Use a sigla do estado com 2 letras.";
  if (name === "pagamento" && storeConfig.paymentMethods.length > 0 && !storeConfig.paymentMethods.includes(clean)) {
    return "Selecione uma forma de pagamento disponível.";
  }
  return undefined;
}

function couponDiscount(coupon: Coupon | null, subtotal: number) {
  if (!coupon) return 0;
  const discount = coupon.type === "percent" ? subtotal * (coupon.value / 100) : coupon.value;
  return Math.min(subtotal, Math.max(0, discount));
}

function Checkout() {
  const { items, total } = useCart();
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const activeCoupons = useMemo(() => storeConfig.coupons.filter((coupon) => coupon.active), []);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const discount = couponDiscount(appliedCoupon, total);
  const finalTotal = Math.max(0, total - discount);

  function applyCoupon() {
    const normalized = couponCode.trim().toUpperCase();
    const coupon = activeCoupons.find((entry) => entry.code.toUpperCase() === normalized) ?? null;
    if (!coupon) {
      setAppliedCoupon(null);
      setCouponMessage("Cupom inválido ou indisponível.");
      return;
    }
    setAppliedCoupon(coupon);
    setCouponMessage(`Cupom ${coupon.code} aplicado.`);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = event.currentTarget.name as FieldName;
    if (!name) return;
    const message = validateField(name, event.currentTarget.value);
    setErrors((current) => ({ ...current, [name]: message }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? "").trim();

    const fields: FieldName[] = ["nome", "telefone", "cep", "endereco", "numero", "bairro", "cidade", "estado"];
    if (storeConfig.paymentMethods.length > 0) fields.push("pagamento");

    const nextErrors = Object.fromEntries(
      fields
        .map((field) => [field, validateField(field, get(field))] as const)
        .filter((entry): entry is readonly [FieldName, string] => Boolean(entry[1])),
    ) as FormErrors;

    setErrors(nextErrors);
    const firstInvalid = fields.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const payment = storeConfig.paymentMethods.length > 0
      ? get("pagamento")
      : "A confirmar no WhatsApp";

    const lines = [
      "Olá, CORRES DO ZK! Quero enviar meu pedido para confirmação.",
      "",
      "DADOS DO CLIENTE",
      `Nome: ${get("nome")}`,
      `Telefone: ${get("telefone")}`,
      `CEP: ${get("cep")}`,
      `Endereço: ${get("endereco")}, ${get("numero")}`,
      `Complemento: ${get("complemento") || "Não informado"}`,
      `Bairro: ${get("bairro")}`,
      `Cidade: ${get("cidade")}`,
      `Estado: ${get("estado").toUpperCase()}`,
      `Forma de pagamento pretendida: ${payment}`,
      "",
      "PRODUTOS",
      ...items.map(
        (item) =>
          `- ${item.name} | Tamanho: ${item.size} | Cor: ${item.color} | Quantidade: ${item.qty} | ${formatBRL(item.price * item.qty)}`,
      ),
      "",
      `Subtotal: ${formatBRL(total)}`,
      ...(appliedCoupon ? [`Cupom: ${appliedCoupon.code}`, `Desconto: -${formatBRL(discount)}`, `Total após cupom: ${formatBRL(finalTotal)}`] : []),
      "Frete e pagamento serão confirmados nesta conversa.",
      "Abrir esta conversa não confirma o pedido nem significa pagamento concluído.",
    ];

    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
    setSending(true);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setSending(false), 700);
  }

  const fieldProps = (name: FieldName) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur: handleBlur,
  });

  const ErrorText = ({ name }: { name: FieldName }) =>
    errors[name] ? <p id={`${name}-error`} className="text-xs font-semibold text-destructive">{errors[name]}</p> : null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="zk-eyebrow text-primary">Finalização</p>
        <h1 className="zk-title mt-3 text-5xl sm:text-6xl">Sua sacola está vazia.</h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">Adicione uma peça à sacola para preencher seus dados e enviar o pedido pelo WhatsApp.</p>
        <Button asChild className="mt-8 h-12 rounded-none px-6 text-xs font-bold uppercase tracking-[0.16em]"><Link to="/loja">Voltar para a coleção</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-6 sm:py-14">
      <Link to="/loja" className="zk-focus inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Continuar comprando
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <form onSubmit={handleSubmit} noValidate className="border border-border bg-card/55 p-5 sm:p-8">
          <div className="border-b border-border pb-6">
            <p className="zk-eyebrow text-primary">1 / Seus dados</p>
            <h1 className="zk-title mt-3 text-[3rem] leading-[.92] sm:text-6xl">Finalizar pedido</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Preencha os dados abaixo. O pedido será enviado ao WhatsApp para confirmação de frete e pagamento.</p>
          </div>

          <div className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" name="nome" required autoComplete="name" placeholder="Seu nome completo" className="h-12" {...fieldProps("nome")} />
              <ErrorText name="nome" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" required autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" className="h-12" {...fieldProps("telefone")} />
              <ErrorText name="telefone" />
            </div>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" name="cep" required autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" className="h-12" {...fieldProps("cep")} />
                <ErrorText name="cep" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" required autoComplete="address-line1" placeholder="Rua, avenida..." className="h-12" {...fieldProps("endereco")} />
                <ErrorText name="endereco" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" name="numero" required inputMode="numeric" placeholder="123" className="h-12" {...fieldProps("numero")} />
                <ErrorText name="numero" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento (opcional)</Label>
                <Input id="complemento" name="complemento" autoComplete="address-line2" placeholder="Apto, bloco..." className="h-12" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" name="bairro" required autoComplete="address-level3" placeholder="Seu bairro" className="h-12" {...fieldProps("bairro")} />
                <ErrorText name="bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" required autoComplete="address-level2" placeholder="Sua cidade" className="h-12" {...fieldProps("cidade")} />
                <ErrorText name="cidade" />
              </div>
            </div>

            <div className="space-y-2 sm:max-w-[180px]">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" name="estado" required autoComplete="address-level1" inputMode="text" maxLength={2} placeholder="SP" className="h-12 uppercase" {...fieldProps("estado")} />
              <ErrorText name="estado" />
            </div>

            {storeConfig.paymentMethods.length > 0 ? (
              <div className="space-y-2">
                <Label htmlFor="pagamento">Forma de pagamento pretendida</Label>
                <select id="pagamento" name="pagamento" defaultValue="" required className="h-12 w-full border border-input bg-background px-3 text-sm outline-none focus:border-primary" {...fieldProps("pagamento")}>
                  <option value="" disabled>Selecione</option>
                  {storeConfig.paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
                </select>
                <ErrorText name="pagamento" />
              </div>
            ) : (
              <div className="border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em]">Forma de pagamento</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Nenhuma forma de pagamento está cadastrada no sistema. A opção será confirmada pelo WhatsApp.</p>
              </div>
            )}

            {activeCoupons.length > 0 && (
              <div className="border-t border-border pt-5">
                <Label htmlFor="cupom">Cupom</Label>
                <div className="mt-2 flex gap-2">
                  <Input id="cupom" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="CÓDIGO" className="h-12 uppercase" />
                  <Button type="button" variant="outline" onClick={applyCoupon} className="h-12 shrink-0 rounded-none"><Tag className="mr-2 h-4 w-4" />Aplicar</Button>
                </div>
                {couponMessage && <p className="mt-2 text-xs text-muted-foreground">{couponMessage}</p>}
              </div>
            )}

            <Button type="submit" size="lg" disabled={sending} className="h-14 w-full rounded-none text-xs font-bold uppercase tracking-[0.16em]">
              <MessageCircle className="mr-2 h-4 w-4" />
              {sending ? "Abrindo WhatsApp..." : "Finalizar pelo WhatsApp"}
            </Button>
          </div>
        </form>

        <aside className="border border-border bg-card/55 p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="zk-eyebrow text-primary">2 / Resumo</p>
          <h2 className="zk-title mt-3 text-3xl">Seu pedido</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-3 border-b border-border pb-4">
                <img src={item.image} alt="" loading="lazy" className="h-20 w-16 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tam. {item.size} · {item.color} · Qtd. {item.qty}</p>
                </div>
                <p className="whitespace-nowrap text-xs font-semibold sm:text-sm">{formatBRL(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-border pt-5">
            <div className="flex items-end justify-between"><span className="zk-eyebrow">Subtotal</span><span className="zk-title text-3xl">{formatBRL(total)}</span></div>
            {appliedCoupon && <div className="flex justify-between text-xs text-muted-foreground"><span>Desconto ({appliedCoupon.code})</span><span>-{formatBRL(discount)}</span></div>}
            {appliedCoupon && <div className="flex justify-between border-t border-border pt-3 text-sm font-bold"><span>Total após cupom</span><span>{formatBRL(finalTotal)}</span></div>}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Frete e pagamento serão confirmados pelo WhatsApp. Abrir a conversa não confirma o pedido e não significa pagamento concluído.</p>
        </aside>
      </div>
    </div>
  );
}

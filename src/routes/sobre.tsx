import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Manifesto — CORRES DO ZK" },
      { name: "description", content: "O manifesto e a história da CORRES DO ZK." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div>
      <section className="zk-grain relative h-[58svh] min-h-[440px]">
        <img src={heroImg} alt="CORRES DO ZK" width={1600} height={1008} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-12 sm:px-6 sm:pb-16">
          <p className="zk-eyebrow text-primary">Manifesto / 001</p>
          <h1 className="zk-title mt-3 max-w-4xl text-6xl sm:text-8xl">Não é sorte.<br /><span className="text-primary">É processo.</span></h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="zk-eyebrow">A origem</p><h2 className="zk-title mt-3 text-5xl">Nascido no corre.</h2></div>
          <div className="max-w-3xl space-y-7 text-sm leading-7 text-muted-foreground">
            <p className="text-xl leading-8 text-foreground/85">CORRES DO ZK começou com uma serigrafia emprestada e vinte camisetas. A escala mudou. O princípio, não.</p>
            <p>Cada drop parte da rua, do bairro e da rotina de quem constrói sem atalho. Desenhamos internamente e produzimos perto de casa, em pequenas quantidades, porque acreditamos que uma peça boa deve carregar intenção.</p>
            <p>Quando um drop acaba, não existe reposição automática. Existe memória. É essa escassez real — e não urgência artificial — que torna cada peça parte da história.</p>
          </div>
        </div>

        <div className="mt-16 grid border-y border-border sm:grid-cols-3">
          {[["2019","Primeira tiragem"],["+12k","Peças entregues"],["100%","Produção local"]].map(([n,l]) => (
            <div key={l} className="border-b border-border p-7 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <p className="zk-title text-5xl text-primary">{n}</p><p className="zk-eyebrow mt-3">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24">
          <p className="zk-eyebrow text-primary">O que não muda</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Material com presença","Produção em pequena escala","Identidade sem fórmula"].map((item, i) => (
              <div key={item} className="zk-surface p-7"><span className="text-[10px] font-bold text-primary">0{i+1}</span><h3 className="mt-12 text-2xl">{item}</h3></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

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
          <h1 className="zk-title mt-3 max-w-4xl text-6xl sm:text-8xl">Nascida na rua.<br /><span className="text-primary">Feita pro seu corre.</span></h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="zk-eyebrow">A origem</p><h2 className="zk-title mt-3 text-5xl">Nascido no corre.</h2></div>
          <div className="max-w-3xl space-y-7 text-sm leading-7 text-muted-foreground">
            <p className="text-xl leading-8 text-foreground/85">Nascida na rua. Feita pro seu corre.</p>
            <p>Uma identidade streetwear construída para acompanhar o corre de quem veste a marca.</p>
            <p>CORRES DO ZK é a expressão de uma identidade feita para acompanhar o corre.</p>
          </div>
        </div>

        <div className="mt-16 border-y border-border">
          <div className="grid gap-4 p-7 sm:grid-cols-3 sm:p-8">
            {["Nascida na rua","Feita pro seu corre","CORRES DO ZK"].map((item, i) => (
              <div key={item} className="border-b border-border pb-4 last:border-b-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 sm:last:border-r-0">
                <p className="text-[10px] font-bold text-primary">0{i + 1}</p>
                <p className="zk-title mt-4 text-2xl">{item}</p>
              </div>
            ))}
          </div>
        </div>    </section>

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

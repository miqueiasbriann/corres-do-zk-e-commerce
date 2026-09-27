import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "A Marca — CORRES DO ZK" },
      {
        name: "description",
        content:
          "A história da CORRES DO ZK: streetwear premium nascido na quebrada, produção local e drops em tiragem limitada.",
      },
      { property: "og:title", content: "A Marca — CORRES DO ZK" },
      {
        property: "og:description",
        content: "Streetwear premium nascido na quebrada, com produção local.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div>
      <div className="zk-grain relative">
        <img
          src={heroImg}
          alt="CORRES DO ZK"
          loading="lazy"
          width={1600}
          height={1008}
          className="h-[42svh] min-h-[360px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <p className="zk-eyebrow">A marca</p>
        <h1 className="zk-title mt-3 text-5xl">Nascido no corre</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            CORRES DO ZK começou com uma serigrafia emprestada e vinte camisetas.
            Hoje é uma marca de streetwear premium que continua com o mesmo
            princípio: peça boa, feita perto de casa, em quantidade limitada.
          </p>
          <p>
            Cada drop conta uma história do bairro — a madrugada, o poste de luz,
            o corre diário. Tudo é desenhado internamente e produzido com
            costureiras e serígrafos parceiros da região.
          </p>
          <p>
            Não trabalhamos com reposição. Quando um drop esgota, ele vira
            memória. É isso que mantém a peça sua de verdade.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { n: "2019", l: "Primeira tiragem" },
            { n: "+12k", l: "Peças entregues" },
            { n: "100%", l: "Produção local" },
          ].map((s) => (
            <div key={s.l} className="zk-surface p-5">
              <p className="zk-title text-4xl text-primary">{s.n}</p>
              <p className="zk-eyebrow mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

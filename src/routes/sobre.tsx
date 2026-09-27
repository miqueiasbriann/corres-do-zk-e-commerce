import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "A Marca — CORRES DO ZK" },
      { name: "description", content: "O corre não para. O estilo acompanha." },
      { property: "og:title", content: "A Marca — CORRES DO ZK" },
      { property: "og:description", content: "O corre não para. O estilo acompanha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  const { content } = useSiteContent();

  return (
    <div className="bg-[#090909] text-white">
      <section className="relative min-h-[560px] overflow-hidden border-b border-white/10 sm:min-h-[640px]">
        <img src={content.images.hero} alt="CORRES DO ZK" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.95),rgba(0,0,0,.56)_52%,rgba(0,0,0,.2))]" />
        <div className="absolute inset-0 zk-grit-overlay" />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1320px] items-end px-4 pb-12 sm:min-h-[640px] sm:px-6 sm:pb-16 lg:px-8">
          <div className="max-w-3xl">
            <img src={content.images.logo} alt="CORRES DO ZK" className="h-auto w-[240px] max-w-[62vw] object-contain sm:w-[320px]" />
            <p className="zk-eyebrow mt-8 text-primary">A marca / identidade</p>
            <h1 className="zk-title mt-3 text-6xl sm:text-8xl">O corre não para.</h1>
            <p className="zk-hand mt-2 text-4xl text-primary sm:text-6xl">O estilo acompanha.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="zk-eyebrow text-primary">CORRES DO ZK</p>
            <h2 className="zk-title mt-3 text-5xl sm:text-6xl">Presença de rua. Identidade própria.</h2>
          </div>
          <div className="max-w-2xl space-y-6 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            <p className="text-xl font-semibold leading-8 text-white">Nascida na rua. Feita pro seu corre.</p>
            <p>A CORRES DO ZK transforma atitude, rotina e identidade em uma linguagem visual direta: preto, branco e vermelho, fotografia de moda e peças que ficam no centro da cena.</p>
            <p>O foco da marca é simples: roupa com presença para acompanhar o seu corre.</p>
            <Link to="/loja" className="zk-focus inline-flex items-center border-b border-primary pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary">Ver coleção <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1320px] gap-px bg-white/10 sm:grid-cols-3">
          {["O corre não para.", "O estilo acompanha.", "Sua identidade."].map((item, index) => (
            <div key={item} className="bg-[#0a0a0a] p-7 sm:p-9">
              <span className="text-[9px] font-black text-primary">0{index + 1}</span>
              <h3 className="zk-title mt-10 text-3xl">{item}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

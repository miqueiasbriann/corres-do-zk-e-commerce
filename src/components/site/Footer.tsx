import { Instagram, MessageCircle, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";

export function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="border-t border-white/10 bg-[#080808] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8 lg:py-16">
        <div>
          <img src={content.images.logo} alt="CORRES DO ZK" className="h-auto w-[220px] max-w-full object-contain sm:w-[250px]" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">O corre não para. O estilo acompanha.</p>
          <div className="mt-6 flex gap-2">
            <a href="https://www.instagram.com/corresdozk/" target="_blank" rel="noreferrer" aria-label="Instagram da CORRES DO ZK" className="zk-focus inline-flex h-10 w-10 items-center justify-center border border-white/15 transition hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.tiktok.com/@corresdozk" target="_blank" rel="noreferrer" aria-label="TikTok da CORRES DO ZK" className="zk-focus inline-flex h-10 w-10 items-center justify-center border border-white/15 transition hover:border-primary hover:text-primary"><Play className="h-4 w-4" /></a>
            <a href="https://wa.me/5518997087679" target="_blank" rel="noreferrer" aria-label="WhatsApp da CORRES DO ZK" className="zk-focus inline-flex h-10 w-10 items-center justify-center border border-white/15 transition hover:border-primary hover:text-primary"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <p className="zk-eyebrow text-white/45">Navegar</p>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li><Link to="/loja" className="transition hover:text-white">Coleção</Link></li>
            <li><Link to="/sobre" className="transition hover:text-white">A marca</Link></li>
            <li><Link to="/contato" className="transition hover:text-white">Contato</Link></li>
          </ul>
        </div>
        <div>
          <p className="zk-eyebrow text-white/45">Atendimento</p>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li><a href="https://wa.me/5518997087679" target="_blank" rel="noreferrer" className="transition hover:text-white">+55 18 99708-7679</a></li>
            <li>Frete confirmado no WhatsApp</li>
            <li>Pagamento confirmado no WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">CORRES DO ZK — TODOS OS DIREITOS RESERVADOS.</div>
    </footer>
  );
}

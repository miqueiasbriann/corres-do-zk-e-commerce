import { Instagram, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/35">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="zk-title text-3xl">CORRES DO <span className="text-primary">ZK</span></p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Nascida na rua. Feita pro seu corre.</p>
          <div className="mt-6 flex gap-2">
            <a href="https://www.instagram.com/corresdozk/" target="_blank" rel="noreferrer" aria-label="Instagram da CORRES DO ZK" className="zk-focus inline-flex h-10 w-10 items-center justify-center border border-border hover:border-primary"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.tiktok.com/@corresdozk" target="_blank" rel="noreferrer" aria-label="TikTok da CORRES DO ZK" className="zk-focus inline-flex h-10 w-10 items-center justify-center border border-border hover:border-primary"><Play className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <p className="zk-eyebrow">Navegar</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/loja" className="hover:text-foreground">Coleção</Link></li>
            <li><Link to="/sobre" className="hover:text-foreground">Manifesto</Link></li>
            <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
          </ul>
        </div>
        <div>
          <p className="zk-eyebrow">Serviço</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Atendimento via WhatsApp</li><li>Frete confirmado pelo WhatsApp</li><li>Pagamento confirmado pelo WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">CORRES DO ZK. Todos os direitos reservados.</div>
    </footer>
  );
}

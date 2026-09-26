import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="zk-title text-2xl">
            CORRES <span className="text-primary">DO ZK</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Streetwear premium feito na quebrada, em tiragens limitadas.
          </p>
        </div>
        <div>
          <p className="zk-eyebrow">Navegar</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/loja" className="hover:text-foreground">Loja</Link></li>
            <li><Link to="/sobre" className="hover:text-foreground">A Marca</Link></li>
            <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
          </ul>
        </div>
        <div>
          <p className="zk-eyebrow">Ajuda</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Trocas em até 7 dias</li>
            <li>Envio para todo o Brasil</li>
            <li>Frete grátis acima de R$ 399</li>
          </ul>
        </div>
        <div>
          <p className="zk-eyebrow">Contato</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>contato@corresdozk.com</li>
            <li>@corresdozk</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CORRES DO ZK. Todos os direitos reservados.
      </div>
    </footer>
  );
}

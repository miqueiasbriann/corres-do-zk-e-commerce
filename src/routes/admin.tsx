import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBRL, products } from "@/data/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — CORRES DO ZK" },
      {
        name: "description",
        content:
          "Painel administrativo da CORRES DO ZK: catálogo, estoque e indicadores da marca.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const estoque = products.reduce((n, p) => n + p.stock, 0);
  const valorEstoque = products.reduce((n, p) => n + p.stock * p.price, 0);

  const cards = [
    { icon: Package, label: "Produtos", value: String(products.length) },
    { icon: ShoppingCart, label: "Peças em estoque", value: String(estoque) },
    { icon: TrendingUp, label: "Valor do estoque", value: formatBRL(valorEstoque) },
    { icon: Users, label: "Drops ativos", value: "3" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="zk-eyebrow">Área privada</p>
      <h1 className="zk-title mt-3 text-5xl">Painel da marca</h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="zk-eyebrow mt-4">{c.label}</p>
            <p className="zk-title mt-2 text-3xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg">Catálogo</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Drop</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.slug}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-muted-foreground">{p.drop}</TableCell>
                <TableCell className="text-right">{formatBRL(p.price)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={p.stock < 15 ? "destructive" : "secondary"}>
                    {p.stock}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Este painel ainda lê o catálogo do arquivo do projeto. Para cadastrar
        produtos, receber pedidos reais e proteger o acesso com login, é preciso
        ligar o banco de dados da marca.
      </p>
    </div>
  );
}

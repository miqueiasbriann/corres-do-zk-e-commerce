import { ProductVariant } from "@/data/products";

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  function addVariant() {
    onChange([
      ...variants,
      { size: "M", color: "Preto", stock: 0 },
    ]);
  }

  function update(index: number, field: keyof ProductVariant, value: string | number) {
    onChange(
      variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <strong>Variantes</strong>
        <button onClick={addVariant} className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold">
          Adicionar
        </button>
      </div>
      <div className="space-y-2">
        {variants.map((variant, index) => (
          <div key={`${variant.size}-${variant.color}-${index}`} className="grid grid-cols-3 gap-2">
            <input className="rounded-lg bg-white/10 p-2" value={variant.size} onChange={(e) => update(index, "size", e.target.value)} />
            <input className="rounded-lg bg-white/10 p-2" value={variant.color} onChange={(e) => update(index, "color", e.target.value)} />
            <input className="rounded-lg bg-white/10 p-2" type="number" value={variant.stock} onChange={(e) => update(index, "stock", Number(e.target.value))} />
          </div>
        ))}
      </div>
    </div>
  );
}

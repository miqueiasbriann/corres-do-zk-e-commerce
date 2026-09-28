type ProductFieldProps = {
  label: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
};

export function ProductField({ label, value, type = "text", onChange }: ProductFieldProps) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none transition focus:border-red-500"
      />
    </label>
  );
}

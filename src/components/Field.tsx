type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: "text" | "number" | "email" | "password" | "date" | "tel";
  required?: boolean;
};

export default function Field({ label, name, defaultValue, type = "text", required = true }: FieldProps) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} required={required} min={type === "number" ? 0 : undefined} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-amber-500" />
    </label>
  );
}

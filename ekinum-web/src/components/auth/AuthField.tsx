import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AuthField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  icon: any;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45">
          <FontAwesomeIcon icon={icon} />
        </div>
        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-2xl border bg-white/5 px-11 py-3 text-white outline-none transition",
            "placeholder:text-white/35",
            error
              ? "border-rose-400/60 ring-2 ring-rose-400/20"
              : "border-white/10 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15",
          ].join(" ")}
        />
      </div>
      {error ? <div className="text-xs text-rose-300">{error}</div> : null}
    </div>
  );
}
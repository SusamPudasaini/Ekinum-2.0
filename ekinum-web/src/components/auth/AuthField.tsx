import type { IconProp } from "@fortawesome/fontawesome-svg-core";
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
  icon: IconProp;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <FontAwesomeIcon icon={icon} />
        </div>

        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-lg border bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition",
            "placeholder:text-slate-400",
            error
              ? "border-rose-300 ring-2 ring-rose-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          ].join(" ")}
        />
      </div>

      {error ? <div className="text-xs text-rose-600">{error}</div> : null}
    </div>
  );
}
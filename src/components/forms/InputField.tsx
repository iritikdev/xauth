type Props = {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  extra?: React.ReactNode;
};

// InputField.tsx
export const InputField = ({
  label,
  icon,
  error,
  children,
  rightElement,
  extra,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end px-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </label>
        {extra}
      </div>

      <div className="relative group">
        {/* Icon container */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none z-10">
          {icon}
        </div>

        {children}

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
};
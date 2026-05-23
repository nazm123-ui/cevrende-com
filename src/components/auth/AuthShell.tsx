export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[440px] px-5 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-8">
        {eyebrow && (
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.025em] leading-tight text-ink-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-[14.5px] text-ink-500 max-w-[360px] mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="bg-white border border-ink-100 rounded-[18px] p-7 sm:p-9 shadow-[0_8px_24px_-12px_rgba(15,17,16,0.05)]">
        {children}
      </div>
    </div>
  );
}

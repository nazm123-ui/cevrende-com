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
    <div className="flex justify-center px-5 sm:px-6 py-10 sm:py-14">
      <div className="w-full max-w-[480px] bg-white border border-ink-100 rounded-[18px] p-7 sm:p-10 shadow-[0_1px_0_rgba(15,17,16,.02),0_8px_24px_-12px_rgba(15,17,16,.10)]">
        {eyebrow && (
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-2.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.02em] leading-[1.15] m-0 text-ink-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-ink-500 text-[14.5px] mt-2.5 mb-0 leading-[1.55]">
            {subtitle}
          </p>
        )}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

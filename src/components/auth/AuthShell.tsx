export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
        )}
      </div>
      <div className="bg-white border border-ink-100 rounded-2xl shadow-sm p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

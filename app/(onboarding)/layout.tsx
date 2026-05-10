
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6">
      <div className="w-full max-w-[430px] flex flex-col">
        {children}
      </div>
    </main>
  );
}

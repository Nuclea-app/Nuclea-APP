import { BottomNav } from "@/components/nuclea/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-center bg-background">
      <div className="relative w-full max-w-[430px] flex flex-col pb-[80px]">
        {children}
        <BottomNav />
      </div>
    </main>
  );
}

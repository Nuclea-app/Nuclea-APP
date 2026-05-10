import { SparkIcon } from "./SparkIcon";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-1 font-sans font-semibold tracking-[0.3em] text-foreground", className)}>
      <span>NUCLEA</span>
      <SparkIcon className="text-sm" />
    </div>
  );
};

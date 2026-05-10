import { cn } from "@/lib/utils";

interface SparkIconProps {
  className?: string;
}

export const SparkIcon = ({ className }: SparkIconProps) => {
  return (
    <span className={cn("inline-block", className)}>
      ✦
    </span>
  );
};

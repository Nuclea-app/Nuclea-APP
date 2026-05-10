import { ButtonHTMLAttributes } from "react";
import { SparkIcon } from "./SparkIcon";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  iconLeft?: boolean;
  iconRight?: boolean;
}

export const PrimaryButton = ({
  children,
  className,
  iconLeft = true,
  iconRight = true,
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      className={cn(
        "relative flex w-full items-center justify-center rounded-sm bg-foreground px-6 py-4 text-sm font-semibold tracking-wider text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:bg-disabled cursor-pointer disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {iconLeft && (
        <div className="absolute left-6">
          <SparkIcon className="text-sm" />
        </div>
      )}

      <span className="uppercase">{children}</span>

      {iconRight && (
        <div className="absolute right-6">
          <MoveRight className="h-5 w-5" />
        </div>
      )}
    </button>
  );
};

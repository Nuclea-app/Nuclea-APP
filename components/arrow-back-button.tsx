import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ArrowBackButton = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="cursor-pointer flex items-center justify-center hover:opacity-60 transition-opacity"
    >
      <ArrowLeft className="h-4 w-4" />
    </div>
  );
};

export default ArrowBackButton;

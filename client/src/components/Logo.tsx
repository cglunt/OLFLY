import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  };

  return (
    <div className={cn("font-heading font-bold tracking-tight select-none", sizeClasses[size], className)}>
      <span className="text-white">OLF</span>
      <span className="text-[#ac41c3]">LY</span>
    </div>
  );
}

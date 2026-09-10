import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Abricot"
      width={160}
      height={40}
      className={`select-none ${className}`}
    />
  );
}

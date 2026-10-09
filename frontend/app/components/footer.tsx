import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="px-6 flex items-center justify-between">
        <div className="relative h-8 w-28">
          <Image
            src="/Logo_noir.png"
            alt="Abricot"
            fill
            className="object-contain object-left"
            sizes="120px"
          />
        </div>

        <p className="text-sm text-gray-600">
          Abricot 2025
        </p>
      </div>
    </footer>
  );
}
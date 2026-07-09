import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryTileProps {
  id: string;
  label: string;
  image: string;
}

export default function CategoryTile({ id, label, image }: CategoryTileProps) {
  return (
    <Link href={`/menu?category=${id}`} className="group block relative overflow-hidden rounded-2xl aspect-square bg-brand-brown/5">
      {image ? (
        <Image 
          src={image}
          alt={label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-cream flex items-center justify-center">
          <span className="text-brand-brown/40 font-serif italic">Coming Soon</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-brand-brown/20 to-transparent flex flex-col justify-end p-4 sm:p-6">
        <h3 className="text-white font-serif text-lg sm:text-xl font-bold mb-1">{label}</h3>
        <div className="flex items-center text-brand-cream text-xs font-medium transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span>View</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </Link>
  );
}

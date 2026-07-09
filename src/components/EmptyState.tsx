import { SearchX } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-brand-brown/5 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-brand-tan" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-brand-brown mb-2">{title}</h3>
      <p className="text-brand-brown/70 max-w-md mx-auto mb-8">{message}</p>
      
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-tan hover:bg-[#b07848] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

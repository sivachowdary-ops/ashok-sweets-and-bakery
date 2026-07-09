import Image from 'next/image';
import { products } from '../../data/products';
import sourcesData from '../../data/image-sources.json';
import Link from 'next/link';

export default function ReviewPage() {
  const sources = sourcesData as Record<string, any>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Image Review Grid</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
        
        <p className="mb-8 text-gray-600">
          Review the downloaded Pexels images to ensure they match the physical products correctly.
          No two products should share the same image.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map(product => {
            const source = sources[product.id];
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative aspect-square w-full bg-gray-100">
                  <Image 
                    src={product.image || '/images/placeholder.webp'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>ID: <span className="font-mono bg-gray-100 px-1 rounded">{product.id}</span></p>
                    {source ? (
                      <>
                        <p>Source: {source.source} <a href={source.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">({source.id})</a></p>
                        <p>Photographer: {source.photographer}</p>
                      </>
                    ) : (
                      <p className="text-orange-500">No source found</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

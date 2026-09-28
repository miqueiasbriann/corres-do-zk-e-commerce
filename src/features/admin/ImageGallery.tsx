type ImageGalleryProps = {
  images: string[];
  onRemove: (index: number) => void;
};

export function ImageGallery({ images, onRemove }: ImageGalleryProps) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-white/10">
          <img src={image} alt="Produto" className="h-28 w-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-red-400"
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}

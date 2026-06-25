import { ReviewBadge } from './ReviewBadge';

export interface HotelCardData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  pricePerNight: number;
  starRating: number;
  reviewScore: number;
}

export interface HotelCardProps {
  hotel: HotelCardData;
  onSelect?: (id: string) => void;
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <button
        type="button"
        onClick={() => onSelect?.(hotel.id)}
        className="block w-full cursor-pointer text-left"
      >
        <div className="aspect-video w-full overflow-hidden">
          <img src={hotel.imageUrl} alt={hotel.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ink">{hotel.name}</h3>
            <ReviewBadge score={hotel.reviewScore} />
          </div>
          <p className="text-sm text-muted">{hotel.location}</p>
          <p aria-label={`${hotel.starRating} estrelas`} className="text-sm text-premium">
            {'★'.repeat(hotel.starRating)}
            <span className="text-border">{'★'.repeat(5 - hotel.starRating)}</span>
          </p>
          <p className="text-lg font-semibold text-ink">
            {priceFormatter.format(hotel.pricePerNight)}{' '}
            <span className="text-sm font-normal text-muted">/ noite</span>
          </p>
        </div>
      </button>
    </article>
  );
}

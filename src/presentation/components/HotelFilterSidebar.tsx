import { Input } from './Input';

export interface HotelFilterValues {
  searchTerm: string;
  minPrice: number;
  maxPrice: number;
  starRatings: number[];
  minReviewScore: number;
}

export interface PriceBounds {
  min: number;
  max: number;
}

export interface HotelFilterSidebarProps {
  value: HotelFilterValues;
  priceBounds: PriceBounds;
  onChange: (value: HotelFilterValues) => void;
}

const STAR_OPTIONS = [5, 4, 3, 2, 1];

export function HotelFilterSidebar({ value, priceBounds, onChange }: HotelFilterSidebarProps) {
  const toggleStar = (star: number) => {
    const nextStarRatings = value.starRatings.includes(star)
      ? value.starRatings.filter((selected) => selected !== star)
      : [...value.starRatings, star];
    onChange({ ...value, starRatings: nextStarRatings });
  };

  return (
    <aside className="flex w-full flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-card lg:w-72">
      <Input
        label="Buscar"
        type="search"
        placeholder="Nome ou localização"
        value={value.searchTerm}
        onChange={(event) => onChange({ ...value, searchTerm: event.target.value })}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">Faixa de preço (por noite)</legend>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Mínimo: R$ {value.minPrice}
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={value.minPrice}
            onChange={(event) => onChange({ ...value, minPrice: Number(event.target.value) })}
            className="accent-brand"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Máximo: R$ {value.maxPrice}
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={value.maxPrice}
            onChange={(event) => onChange({ ...value, maxPrice: Number(event.target.value) })}
            className="accent-brand"
          />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">Classificação</legend>
        {STAR_OPTIONS.map((star) => (
          <label
            key={star}
            className="flex cursor-pointer items-center gap-2 text-sm text-premium opacity-80 transition-opacity hover:opacity-100"
          >
            <input
              type="checkbox"
              checked={value.starRatings.includes(star)}
              onChange={() => toggleStar(star)}
              className="accent-brand"
            />
            {'★'.repeat(star)}
          </label>
        ))}
      </fieldset>

      <Input
        label="Nota mínima de avaliação"
        type="number"
        min={0}
        max={10}
        step={0.1}
        value={value.minReviewScore}
        onChange={(event) => onChange({ ...value, minReviewScore: Number(event.target.value) })}
      />
    </aside>
  );
}

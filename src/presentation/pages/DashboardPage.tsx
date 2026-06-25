import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { HotelCard } from '../components/HotelCard';
import { HotelCardSkeleton } from '../components/HotelCardSkeleton';
import { HotelFilterSidebar } from '../components/HotelFilterSidebar';
import type { HotelFilterValues } from '../components/HotelFilterSidebar';
import { useHotelDashboard } from '../hooks/useHotelDashboard';

const PRICE_BOUNDS = { min: 0, max: 5000 };

const DEFAULT_FILTERS: HotelFilterValues = {
  searchTerm: '',
  minPrice: PRICE_BOUNDS.min,
  maxPrice: PRICE_BOUNDS.max,
  starRatings: [],
  minReviewScore: 0,
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { status, hotels, error, applyFilters, deleteHotel, seedDemoHotels } = useHotelDashboard();
  const [filterValues, setFilterValues] = useState<HotelFilterValues>(DEFAULT_FILTERS);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleFilterChange = (next: HotelFilterValues) => {
    setFilterValues(next);
    applyFilters({
      searchTerm: next.searchTerm || undefined,
      minPrice: next.minPrice,
      maxPrice: next.maxPrice,
      starRatings: next.starRatings.length > 0 ? next.starRatings : undefined,
      minReviewScore: next.minReviewScore || undefined,
    });
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteHotel(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  const hotelCards = useMemo(
    () =>
      hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        imageUrl: hotel.imageUrl,
        pricePerNight: hotel.pricePerNight,
        starRating: hotel.starRating,
        reviewScore: hotel.reviewScore,
      })),
    [hotels],
  );

  return (
    <main className="flex flex-col gap-6 p-6 lg:flex-row">
      <HotelFilterSidebar
        value={filterValues}
        priceBounds={PRICE_BOUNDS}
        onChange={handleFilterChange}
      />

      <section className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink">Hotéis</h1>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => void seedDemoHotels()}>
              Restaurar dados de demonstração
            </Button>
            <Button type="button" onClick={() => navigate('/hotels/new')}>
              Cadastrar hotel
            </Button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
          </div>
        )}

        {status === 'success' && hotelCards.length === 0 && (
          <EmptyState
            title="Nenhum hotel encontrado"
            description="Ajuste os filtros ou cadastre um novo hotel para começar."
          />
        )}

        {status === 'success' && hotelCards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {hotelCards.map((hotel) => (
              <div key={hotel.id} className="flex flex-col gap-2">
                <HotelCard hotel={hotel} onSelect={(id) => navigate(`/hotels/${id}`)} />
                <Button type="button" variant="ghost" onClick={() => setPendingDeleteId(hotel.id)}>
                  Excluir
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Excluir hotel"
        description="Esta ação não pode ser desfeita. Tem certeza que deseja excluir este hotel?"
        confirmLabel="Excluir"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </main>
  );
}

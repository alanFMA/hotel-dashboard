import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { HotelForm } from '../components/HotelForm';
import type { HotelFormValues } from '../components/HotelForm';
import { useHotel } from '../hooks/useHotel';
import { useHotelDashboard } from '../hooks/useHotelDashboard';

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hotel, status } = useHotel(id);
  const { updateHotel, deleteHotel } = useHotelDashboard();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleUpdate = async (values: HotelFormValues) => {
    if (!hotel) {
      return;
    }
    await updateHotel(hotel.id, values);
    navigate('/');
  };

  const handleDelete = async () => {
    if (!hotel) {
      return;
    }
    await deleteHotel(hotel.id);
    navigate('/');
  };

  if (status === 'loading') {
    return <p className="p-6 text-sm text-muted">Carregando hotel...</p>;
  }

  if (!hotel) {
    return (
      <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
        <p className="text-sm text-destructive">Hotel não encontrado.</p>
        <Link to="/" className="text-sm font-medium text-brand underline">
          ← Voltar para a lista
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand underline"
      >
        ← Voltar para a lista
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">{hotel.name}</h1>
        <Button type="button" variant="destructive" onClick={() => setConfirmingDelete(true)}>
          Excluir
        </Button>
      </div>

      <HotelForm
        submitLabel="Salvar alterações"
        initialValues={hotel.toProps()}
        onSubmit={(values) => void handleUpdate(values)}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Excluir hotel"
        description="Esta ação não pode ser desfeita. Tem certeza que deseja excluir este hotel?"
        confirmLabel="Excluir"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => void handleDelete()}
      />
    </main>
  );
}

import { useNavigate } from 'react-router-dom';
import { HotelForm } from '../components/HotelForm';
import type { HotelFormValues } from '../components/HotelForm';
import { useHotelDashboard } from '../hooks/useHotelDashboard';

export function CreateHotelPage() {
  const navigate = useNavigate();
  const { createHotel } = useHotelDashboard();

  const handleSubmit = async (values: HotelFormValues) => {
    await createHotel(values);
    navigate('/');
  };

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Cadastrar um novo hotel</h1>
      <HotelForm submitLabel="Cadastrar hotel" onSubmit={(values) => void handleSubmit(values)} />
    </main>
  );
}

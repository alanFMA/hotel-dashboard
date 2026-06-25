import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { TextArea } from './TextArea';

export interface HotelFormValues {
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  starRating: number;
  imageUrl: string;
  reviewScore: number;
}

export interface HotelFormProps {
  initialValues?: HotelFormValues;
  submitLabel: string;
  onSubmit: (values: HotelFormValues) => void;
}

const EMPTY_VALUES: HotelFormValues = {
  name: '',
  description: '',
  location: '',
  pricePerNight: 0,
  starRating: 1,
  imageUrl: '',
  reviewScore: 0,
};

export function HotelForm({ initialValues = EMPTY_VALUES, submitLabel, onSubmit }: HotelFormProps) {
  const [values, setValues] = useState<HotelFormValues>(initialValues);
  const starRatingId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-card"
    >
      <Input
        label="Nome do hotel"
        required
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
      />
      <TextArea
        label="Descrição"
        required
        rows={4}
        value={values.description}
        onChange={(event) => setValues({ ...values, description: event.target.value })}
      />
      <Input
        label="Localização"
        required
        value={values.location}
        onChange={(event) => setValues({ ...values, location: event.target.value })}
      />
      <Input
        label="URL da imagem"
        required
        type="url"
        value={values.imageUrl}
        onChange={(event) => setValues({ ...values, imageUrl: event.target.value })}
      />
      <Input
        label="Preço por diária (R$)"
        required
        type="number"
        min={0}
        step={0.01}
        value={values.pricePerNight}
        onChange={(event) => setValues({ ...values, pricePerNight: Number(event.target.value) })}
      />
      <label htmlFor={starRatingId} className="flex flex-col gap-1 text-sm font-medium text-ink">
        Classificação (estrelas)
        <select
          id={starRatingId}
          value={values.starRating}
          onChange={(event) => setValues({ ...values, starRating: Number(event.target.value) })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {'★'.repeat(star)}
            </option>
          ))}
        </select>
      </label>
      <Input
        label="Nota de avaliação (0 a 10)"
        required
        type="number"
        min={0}
        max={10}
        step={0.1}
        value={values.reviewScore}
        onChange={(event) => setValues({ ...values, reviewScore: Number(event.target.value) })}
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}

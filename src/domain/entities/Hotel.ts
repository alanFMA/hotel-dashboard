import { DomainValidationError } from '../errors/DomainValidationError';

export interface HotelProps {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  starRating: number;
  imageUrl: string;
  reviewScore: number;
}

const MIN_STAR_RATING = 1;
const MAX_STAR_RATING = 5;
const MIN_REVIEW_SCORE = 0;
const MAX_REVIEW_SCORE = 10;

export class Hotel {
  private constructor(private readonly props: HotelProps) {}

  static create(props: HotelProps): Hotel {
    Hotel.assertNotBlank(props.name, 'name');
    Hotel.assertNotBlank(props.description, 'description');
    Hotel.assertNotBlank(props.location, 'location');
    Hotel.assertNotBlank(props.imageUrl, 'imageUrl');

    if (props.pricePerNight < 0) {
      throw new DomainValidationError('pricePerNight must not be negative.');
    }

    if (
      !Number.isInteger(props.starRating) ||
      props.starRating < MIN_STAR_RATING ||
      props.starRating > MAX_STAR_RATING
    ) {
      throw new DomainValidationError(
        `starRating must be an integer between ${MIN_STAR_RATING} and ${MAX_STAR_RATING}.`,
      );
    }

    if (props.reviewScore < MIN_REVIEW_SCORE || props.reviewScore > MAX_REVIEW_SCORE) {
      throw new DomainValidationError(
        `reviewScore must be between ${MIN_REVIEW_SCORE} and ${MAX_REVIEW_SCORE}.`,
      );
    }

    return new Hotel({ ...props });
  }

  private static assertNotBlank(value: string, field: string): void {
    if (value.trim().length === 0) {
      throw new DomainValidationError(`${field} must not be blank.`);
    }
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get location(): string {
    return this.props.location;
  }

  get pricePerNight(): number {
    return this.props.pricePerNight;
  }

  get starRating(): number {
    return this.props.starRating;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get reviewScore(): number {
    return this.props.reviewScore;
  }

  toProps(): HotelProps {
    return { ...this.props };
  }
}

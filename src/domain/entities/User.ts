import { DomainValidationError } from '../errors/DomainValidationError';

export interface UserProps {
  id: string;
  email: string;
  displayName: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    if (props.id.trim().length === 0) {
      throw new DomainValidationError('id must not be blank.');
    }

    if (!EMAIL_PATTERN.test(props.email)) {
      throw new DomainValidationError('email must be a valid email address.');
    }

    return new User({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  toProps(): UserProps {
    return { ...this.props };
  }
}

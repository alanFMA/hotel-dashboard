import { describe, expect, it } from 'vitest';
import { User } from './User';
import { DomainValidationError } from '../errors/DomainValidationError';

const validProps = {
  id: 'user-1',
  email: 'clara@hoteldashboard.com',
  displayName: 'Clara',
};

describe('User entity', () => {
  it('creates a valid user', () => {
    const user = User.create(validProps);

    expect(user.id).toBe(validProps.id);
    expect(user.email).toBe(validProps.email);
    expect(user.displayName).toBe(validProps.displayName);
  });

  it('allows a null displayName', () => {
    expect(() => User.create({ ...validProps, displayName: null })).not.toThrow();
  });

  it('rejects a blank id', () => {
    expect(() => User.create({ ...validProps, id: '  ' })).toThrow(DomainValidationError);
  });

  it.each(['not-an-email', 'missing-domain@', '@missing-local.com', ''])(
    'rejects an invalid email "%s"',
    (email) => {
      expect(() => User.create({ ...validProps, email })).toThrow(DomainValidationError);
    },
  );
});

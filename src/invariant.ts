/* eslint-disable no-restricted-syntax */
const isProduction: boolean = process.env.NODE_ENV === 'production';
const prefix = 'Invariant failed';

export class RbdInvariant extends Error {}

RbdInvariant.prototype.toString = function toString() {
  return this.message;
};

// A copy-paste of tiny-invariant but with a custom error type
// Throw an error if the condition fails
export function invariant(
  condition: unknown,
  message?: string,
): asserts condition {
  if (condition) {
    return;
  }

  if (isProduction) {
    // In production we strip the message but still throw
    throw new RbdInvariant(prefix);
  } else {
    // When not in production we allow the message to pass through
    // *This block will be removed in production builds*
    throw new RbdInvariant(`${prefix}: ${message || ''}`);
  }
}

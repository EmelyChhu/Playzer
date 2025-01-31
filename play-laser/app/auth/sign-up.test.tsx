jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
  })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({
      docs: [{ data: () => ({ id: '1', name: 'Workout' }) }],
      })),
    addDoc: jest.fn(),
  })),
}));

import { isValidEmail, isValidPassword } from './sign-up';

test('isValidEmail returns true for valid emails', () => {
  expect(isValidEmail('example@gmail.com')).toBe(true);
  expect(isValidEmail('u@ufl.edu')).toBe(true);
});

test('isValidEmail returns false for invalid emails', () => {
  expect(isValidEmail('gmail')).toBe(false);
  expect(isValidEmail('user@com')).toBe(false);
  expect(isValidEmail('@domain.com')).toBe(false);
  expect(isValidEmail('user@domain.')).toBe(false);
});

test('isValidPassword returns true for valid passwords', () => {
  expect(isValidPassword('12345678')).toBe(true);
  expect(isValidPassword('password5')).toBe(true);
});

test('isValidPassword returns false for invalid passwords', () => {
  expect(isValidPassword('hi')).toBe(false);
  expect(isValidPassword('1234567')).toBe(false);
});

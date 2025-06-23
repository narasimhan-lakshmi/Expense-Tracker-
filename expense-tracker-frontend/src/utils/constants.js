export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    PROFILE: '/user/profile'
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id) => `/expenses/${id}`
  }
};
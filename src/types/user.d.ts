// Extend the User interface to include profilePicture
declare global {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'patient' | 'physiotherapist' | 'admin';
    token?: string;
    profilePicture?: string;
  }
}

export {};

export interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

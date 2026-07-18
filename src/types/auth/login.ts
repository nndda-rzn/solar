export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export interface LoginState {
  isLoading: boolean;
  errors: LoginFormErrors;
  showPassword: boolean;
}

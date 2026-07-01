export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export interface LoginState {
  isLoading: boolean;
  errors: LoginFormErrors;
  showPassword: boolean;
}

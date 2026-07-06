export function validateUsername(username: string): string | null {
  if (!username) return "Username harus diisi";
  if (username.length < 3) return "Username minimal 3 karakter";
  if (username.length > 20) return "Username maksimal 20 karakter";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username hanya boleh huruf, angka, dan underscore";
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email harus diisi";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Format email tidak valid";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password harus diisi";
  if (password.length < 6) return "Password minimal 6 karakter";
  return null;
}

export function validateLoginForm(values: { email: string; password: string }) {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupForm(values: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const errors: Record<string, string> = {};

  const usernameError = validateUsername(values.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password harus diisi";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password tidak cocok";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

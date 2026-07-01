export function validateUsername(username: string): string | null {
  if (!username) return "Username harus diisi";
  if (username.length < 3) return "Username minimal 3 karakter";
  if (username.length > 20) return "Username maksimal 20 karakter";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username hanya boleh huruf, angka, dan underscore";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password harus diisi";
  if (password.length < 6) return "Password minimal 6 karakter";
  return null;
}

export function validateLoginForm(values: {
  username: string;
  password: string;
}) {
  const errors: Record<string, string> = {};

  const usernameError = validateUsername(values.username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

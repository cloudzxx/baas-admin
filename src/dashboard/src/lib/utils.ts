export function getToken(): string | null {
  return localStorage.getItem('baas-admin-token');
}

export function setToken(token: string): void {
  localStorage.setItem('baas-admin-token', token);
}

export function removeToken(): void {
  localStorage.removeItem('baas-admin-token');
}

export function getAuthority(): string[] {
  const role = localStorage.getItem('baas-admin-role');
  return role ? [role] : ['member'];
}

export function setAuthority(role: string): void {
  localStorage.setItem('baas-admin-role', role);
}

export function removeAuthority(): void {
  localStorage.removeItem('baas-admin-role');
}

export function stringify(obj: Record<string, unknown>): string {
  return new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null) as [string, string][]
  ).toString();
}

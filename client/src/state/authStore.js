// ultra-simple auth store for v1 (upgrade later to context/reducer/zustand if desired)
const TOKEN_KEY = "lms_token";
const ROLE_KEY = "lms_role"; // "STUDENT" | "TEACHER"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
}

export function isAuthed() {
  return Boolean(getToken());
}

export function logout() {
  clearToken();
  clearRole();
}

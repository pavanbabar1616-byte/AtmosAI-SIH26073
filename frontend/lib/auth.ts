import type { User } from "@/stores/authStore";

const USERS_KEY = "atmosai-users";

interface StoredUser extends User {
  password: string;
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: StoredUser) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUser(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  return { valid: true };
}

export function createUser(
  name: string,
  email: string,
  password: string,
  role = "Operator"
): User {
  const id = crypto.randomUUID();
  const user: StoredUser = { id, name, email, password, role };
  saveUser(user);
  return { id, name, email, role };
}
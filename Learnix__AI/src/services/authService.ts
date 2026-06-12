import { User } from '../types';

const USERS_KEY = 'learnix_users';
const CURRENT_USER_KEY = 'learnix_current_user';

export class AuthService {
  private getUsers(): User[] {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  register(name: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Registration successful' };
  }

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const userWithoutPassword = { ...user, password: '' };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Login successful', user: userWithoutPassword };
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();

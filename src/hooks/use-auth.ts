// Simplified auth - no Blink dependency
export function useAuth() {
  return {
    user: { id: 'local-user', email: 'user@local' },
    isAuthenticated: true,
    login: () => {},
    logout: () => {}
  }
}

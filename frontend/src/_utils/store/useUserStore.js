import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem("user")) || null,

  setUser: (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  clearUser: () => {
    sessionStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useUserStore;
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
  isSameUser: (data) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    if (!storedUser || !data) return false; // Return false if missing data
    return JSON.stringify(storedUser) === JSON.stringify(data); // Deep comparison
  }

}));

export default useUserStore;
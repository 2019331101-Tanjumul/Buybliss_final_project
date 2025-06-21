// .useLocalStorage.js

import { getCurrentUser } from "../utils/actions";

export const useUserStorage = () => {
  const key = "user";

  const setUser = async () => {
    try {
      const user = await getCurrentUser();
      localStorage.setItem(key, JSON.stringify(user));
    } catch (error) {
      console.error("useUserStorage: setUser:", error);
    }
  };

  const getUser = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error("useUserStorage: getUser:", error);
    }
  }

  const removeUser = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("useUserStorage: removeUser:", error);
    }
  }

  return { setUser, getUser, removeUser };
};
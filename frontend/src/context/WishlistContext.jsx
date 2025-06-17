// WishlistContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { getWishlist } from "../utils/actions";
import { useUserStorage } from "../hooks/useLocalStorage";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const { getUser } = useUserStorage();

  const updateWishlistCount = async () => {
    const user = getUser();
    if (user) {
      try {
        const items = await getWishlist(user.email);
        setWishlistCount(items.length);
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateWishlistCount();
  }, []);

  return <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>{children}</WishlistContext.Provider>;
};

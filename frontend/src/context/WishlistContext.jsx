// WishlistContext.jsx

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getWishlist } from "../utils/actions";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children, user }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateWishlistCount = useCallback(async () => {
    try {
      if (user?.email) {
        const items = await getWishlist(user?.email);
        setWishlistCount(items.length);
      } else {
        setWishlistCount(0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  }, [user?.email]);

  const clearWishlistCount = () => {
    setWishlistCount(0);
  };

  useEffect(() => {
    updateWishlistCount();
  }, [updateWishlistCount]);
  return (
    <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount, clearWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

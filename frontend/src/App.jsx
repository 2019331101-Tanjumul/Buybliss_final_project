import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { isAuthenticated } from "./utils/actions";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Wishlist from "./components/Wishlist";
import CompareProducts from "./components/CompareProducts";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";

import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { useUserStorage } from "./hooks/useUserStorage";

function App() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const { removeUser, getUser } = useUserStorage();
  const checkAuth = useCallback(async () => {
    try {
      const res = await isAuthenticated();
      if (!res.data) {
        removeUser();
        setUser(null);
        setAuth(null);
      } else {
        setAuth(res.data);
        setUser(getUser()); // only after confirming auth
      }
    } catch {
      removeUser();
      setUser(null);
      setAuth(null);
    }
  }, [getUser, removeUser]);

  useEffect(() => {
    checkAuth();
  }, [removeUser, getUser, checkAuth]);

  return (
    <WishlistProvider user={user}>
      <CompareProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout user={user} setUser={setUser} />}>
              <Route index element={<Home />} />
              <Route path="/products/:searchKey/:currentPage" element={<ProductList />} />
              <Route path="/wishlist" element={auth ? <Wishlist /> : <Home />} />
              <Route path="/product-details/:productId" element={<ProductDetails />} />
              <Route path="/compare-products" element={<CompareProducts />} />
            </Route>
            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Routes>
        </BrowserRouter>
      </CompareProvider>
    </WishlistProvider>
  );
}

export default App;

// CompareContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useCompareStorage } from "../hooks/useCompareStorage";

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareCount, setCompareCount] = useState(0);
  const { getProducts } = useCompareStorage();

  const updateCompareCount = () => {
    const items = getProducts();
    setCompareCount(items.length);
  };

  useEffect(() => {
    updateCompareCount();
  }, []);

  return <CompareContext.Provider value={{ compareCount, updateCompareCount }}>{children}</CompareContext.Provider>;
};

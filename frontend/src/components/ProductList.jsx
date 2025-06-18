import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";
import Skeleton from "react-loading-skeleton";
import Product from "./Product";
import { Button } from "../components/ui/Button";

import "react-loading-skeleton/dist/skeleton.css";
import { fetchProducts } from "../utils/actions";
import { Spinner } from "./ui/Spinner";
import { SortIcon } from "./ui/SortIcon";

const ProductList = () => {
  const { setShowLogin } = useOutletContext();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [stockFilter, setStockFilter] = useState("all");
  const sortButtonText = sortAsc ? "Low To High" : "High To Low";

  const { searchKey, currentPage } = useParams();

  useEffect(() => {
    fetchProducts(searchKey, currentPage).then((products) => {
      setProductList(products);
      setLoading(false);
    });
  }, [searchKey, currentPage]);

  const filteredSortedProducts = useMemo(() => {
    const filtered = productList.filter((p) => {
      const isStock = typeof p.price === "number";
      if (stockFilter === "in") return isStock;
      if (stockFilter === "out") return !isStock;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const isAStock = typeof a.price === "number";
      const isBStock = typeof b.price === "number";

      if (!isAStock && isBStock) return 1;
      if (isAStock && !isBStock) return -1;
      if (!isAStock && !isBStock) return 0;

      return sortAsc ? a.price - b.price : b.price - a.price;
    });
  }, [productList, sortAsc, stockFilter]);

  return (
    <div className="products-container">
      {loading ? (
        <>
          <Spinner />
          <div className="loading-sort-btn">
            <Skeleton className="loading-sort-btn" />
          </div>
          <section className="product-list">
            {Array.from({ length: 50 }).map((_, index) => (
              <div key={index} className="loading-product">
                <Skeleton className="loading-img" />
                <div>
                  <Skeleton />
                  <Skeleton className="loading-title" />
                </div>
                <Skeleton className="loading-price" />
              </div>
            ))}
          </section>
        </>
      ) : productList.length === 0 ? (
        <>
          <img src={"/empty-box.jpg"} alt="no products left" className="empty-product-img" />
          <div className="pagination">
            <Button onClick={() => navigate(`/`)}>Go Home</Button>
          </div>
        </>
      ) : (
        <>
          <div className="filter-sort">
            <div className="stock-filter">
              <label className="filter">
                <input
                  type="radio"
                  name="stock"
                  value="all"
                  checked={stockFilter === "all"}
                  onChange={() => setStockFilter("all")}
                />
                All
              </label>
              <label className="filter">
                <input
                  type="radio"
                  name="stock"
                  value="in"
                  checked={stockFilter === "in"}
                  onChange={() => setStockFilter("in")}
                />
                In Stock
              </label>
              <label className="filter">
                <input
                  type="radio"
                  name="stock"
                  value="out"
                  checked={stockFilter === "out"}
                  onChange={() => setStockFilter("out")}
                />
                Out of Stock
              </label>
            </div>
            <Button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
              Price: {sortButtonText}
              <SortIcon />
            </Button>
          </div>
          <section className="product-list">
            {filteredSortedProducts?.map((product) => (
              <Product key={product.productDetailsLink} {...product} setShowLogin={setShowLogin} />
            ))}
          </section>
          <div className="pagination">
            <Button
              onClick={() => {
                setLoading(true);
                navigate(`/products/${searchKey}/${Number(currentPage) - 1}`);
              }}
              disabled={Number(currentPage) - 1 < 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                setLoading(true);
                navigate(`/products/${searchKey}/${Number(currentPage) + 1}`);
              }}
              disabled={productList.length === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;

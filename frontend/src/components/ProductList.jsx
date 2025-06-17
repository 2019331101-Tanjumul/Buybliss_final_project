import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";
import Skeleton from "react-loading-skeleton";
import Product from "./Product";
import { Button } from "../components/ui/Button";

import "react-loading-skeleton/dist/skeleton.css";
import { fetchProducts } from "../utils/actions";

const ProductList = () => {
  const { setShowLogin } = useOutletContext();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const sortButtonText = sortAsc ? "Low To High" : "High To Low";

  const { searchKey, currentPage } = useParams();

  useEffect(() => {
    fetchProducts(searchKey, currentPage).then((products) => {
      setProductList(products);
      setLoading(false);
    });
  }, [searchKey, currentPage]);

  const sortedProducts = useMemo(() => {
    return [...productList].sort((a, b) => {
      const isAStock = typeof a.price === "number";
      const isBStock = typeof b.price === "number";

      // Out of stock or invalid price should go to the end
      if (!isAStock && isBStock) return 1;
      if (isAStock && !isBStock) return -1;
      if (!isAStock && !isBStock) return 0;

      // Both are numbers, do actual sorting
      return sortAsc ? a.price - b.price : b.price - a.price;
    });
  }, [productList, sortAsc]);

  return (
    <div className="products-container">
      {loading ? (
        <>
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
          <Button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
            Price: {sortButtonText}
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                strokeWidth="1.5"
                d="M16 5.25C16.2029 5.25 16.3972 5.33222 16.5384 5.47789L20.5384 9.60289C20.8268 9.90025 20.8195 10.3751 20.5221 10.6634C20.2247 10.9518 19.7499 10.9445 19.4616 10.6471L16.75 7.8508L16.75 18C16.75 18.4142 16.4142 18.75 16 18.75C15.5858 18.75 15.25 18.4142 15.25 18L15.25 7.8508L12.5384 10.6471C12.2501 10.9445 11.7753 10.9518 11.4779 10.6634C11.1805 10.3751 11.1732 9.90025 11.4616 9.60289L15.4616 5.47789C15.6028 5.33222 15.7971 5.25 16 5.25ZM8 5.25C8.41421 5.25 8.75 5.58579 8.75 6L8.75 16.1492L11.4616 13.3529C11.7499 13.0555 12.2247 13.0482 12.5221 13.3366C12.8195 13.6249 12.8268 14.0997 12.5384 14.3971L8.53843 18.5221C8.39717 18.6678 8.20291 18.75 8 18.75C7.79709 18.75 7.60283 18.6678 7.46158 18.5221L3.46158 14.3971C3.17322 14.0997 3.18053 13.6249 3.47789 13.3366C3.77526 13.0482 4.25007 13.0555 4.53843 13.3529L7.25 16.1492L7.25 6C7.25 5.58579 7.58579 5.25 8 5.25Z"
                fill="#ffffff"
              />
            </svg>
          </Button>
          <section className="product-list">
            {sortedProducts?.map((product) => (
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

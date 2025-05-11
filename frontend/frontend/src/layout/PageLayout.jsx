import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import Product from "../components/Product";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";

const PageLayout = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchKey, setSearchKey] = useState("");
  const [productList, setProductList] = useState([]);

  const { searchKey: searchParam } = useParams();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      const url = searchParam ? `http://localhost:3000/${searchParam}` : "http://localhost:3000/";
      const products = await axios.get(url);
      console.log(products);
      setProductList(products.data.data);
    };

    fetchHomeProducts();
  }, [searchParam]);

  const fetchProducts = async () => {
    const url = searchKey ? `http://localhost:3000/${searchKey}` : "http://localhost:3000/";
    console.log(url);
    const products = await axios.get(url);
    console.log(products);
    setProductList(products.data.data);
  };

  return (
    <main>
      <header>
        <div className="search-container">
          <input
            type="text"
            value={searchKey}
            placeholder="Search here ..."
            id="search"
            autoComplete="off"
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchKey) {
                navigate(`/${searchKey}`);
                fetchProducts();
                inputRef.current.blur();
              }
            }}
            ref={inputRef}
          />
          <IoIosSearch
            size={"1.5rem"}
            className="search-icon"
            onClick={(e) => {
              e.preventDefault();
              if (searchKey) {
                fetchProducts();
                navigate(`/${searchKey}`);
              } else {
                inputRef.current.focus();
              }
            }}
          />
        </div>
      </header>
      <div className="container">
        <section className="product-list">
          {productList.length === 0 ? (
            <p>Loading ...</p>
          ) : (
            productList?.map((product) => <Product key={product.productDetailsLink} {...product} />)
          )}
        </section>
      </div>
    </main>
  );
};

export default PageLayout;

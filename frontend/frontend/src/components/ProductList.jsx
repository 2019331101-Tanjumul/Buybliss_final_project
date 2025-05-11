import { useEffect, useState } from "react";
import axios from "axios";
import Product from "./Product";

const ProductList = ({ searchKey }) => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = searchKey ? `http://localhost:3000/${searchKey}` : "http://localhost:3000/";
      console.log(url);
      const products = await axios.get(url);
      if (searchKey) {
        console.log(products);
      }
      setProductList(products.data.data);
    };
    fetchProducts();
  }, []);

  return (
    <section className="product-list">
      {productList.map((product) => (
        <Product key={product.productDetailsLink} {...product} />
      ))}
    </section>
  );
};

export default ProductList;

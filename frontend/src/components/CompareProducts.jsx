import { useCompareStorage } from "../hooks/useCompareStorage";
import { Button } from "./ui/Button";
import { comparisonTable } from "../utils/comparisonTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCompare } from "../context/CompareContext";

const CompareProducts = () => {
  const navigate = useNavigate();
  const { getProducts, removeProduct, clearAll } = useCompareStorage();
  const { updateCompareCount } = useCompare();
  const [products, setProducts] = useState([]);
  const comparableAttributes = comparisonTable(products);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  if (products.length === 0)
    return (
      <div className="products-container">
        <img src="/product-comparison.jpg" alt="Compare Products" className="empty-product-img" />
        <div className="pagination">
          <Button onClick={() => navigate(`/`)}>Go Home</Button>
        </div>
      </div>
    );

  return (
    <div>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>
              <div className="product-comparison">
                <h3>Product Comparison</h3>
                <Button
                  onClick={() => {
                    clearAll();
                    setProducts([]);
                    updateCompareCount();
                  }}
                >
                  Clear All
                </Button>
              </div>
            </th>
            {products.map((product) => (
              <th key={product.productId}>
                <div className="compared-product">
                  <img src={product.imageUrls[0]} alt={product.title} className="compared-product-img" />
                  <h2>{product.title}</h2>
                  <p>Product Id: {product.productId}</p>
                  <Button
                    className="close-modal-btn"
                    onClick={() => {
                      removeProduct(`${product.company}${product.productId}`);
                      setProducts(getProducts());
                      updateCompareCount();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g id="Menu / Close_SM">
                        <path
                          id="Vector"
                          d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
                          stroke="oklch(63.7% 0.237 25.331)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparableAttributes.map((item) => (
            <tr key={item.attribute}>
              <td className="key">{item.attribute}</td>
              {Object.keys(item)
                .filter((key) => key !== "attribute")
                .map((key, i) => (
                  <td key={i}>{item[key]}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareProducts;

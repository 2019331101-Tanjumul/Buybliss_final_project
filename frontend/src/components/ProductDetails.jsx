// frontend/src/components/ProductDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { useCompareStorage } from "../hooks/useCompareStorage";
import { fetchProductDetails, addToWishlist } from "../utils/actions";
import { Button } from "../components/ui/Button";
import { Ratings } from "./Ratings";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useUserStorage } from "../hooks/useUserStorage";

const ProductDetails = () => {
  const { setShowLogin } = useOutletContext();
  const { addProduct } = useCompareStorage();
  const { updateWishlistCount } = useWishlist();
  const { updateCompareCount } = useCompare();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStorage().getUser();

  useEffect(() => {
    setIsLoading(true);
    fetchProductDetails(productId).then(setProduct);
    setIsLoading(false);
  }, [productId]);

  const handleAddToWishlist = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setIsAddingToWishlist(true);
    try {
      await addToWishlist(productId, product.regularPrice || product.specialPrice, product.company, user.email);
      updateWishlistCount(user.email);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    }
    setIsAddingToWishlist(false);
  };

  const handleAddToCompare = async () => {
    setIsAddingToCompare(true);
    try {
      addProduct({ ...product, productDetailsLink: product.productDetailsLink }, `${product.company}${productId}`);
      updateCompareCount();
    } catch (error) {
      console.error("Error adding to compare:", error);
    }
    setIsAddingToCompare(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-container">
      <div className="product-info">
        <div className="product-info-img-container">
          <img src={product.imageUrls[0]} alt={product.title} className="product-info-img" />
        </div>
        <div className="product-info-content">
          <h2>{product.title}</h2>
          <div className="product-info-sort-desc">
            <p className="ratings-reviews">
              <Ratings />
              <Ratings />
              <Ratings />
              <Ratings />
              <Ratings />
              <>{product.reviews}</>
            </p>
            <p className="product-id">Product Id: {product.productId}</p>
            <p>
              <span>Company: </span>
              {product.company}
            </p>
            <div className="special-price">
              <p>Special Price </p>
              <p className="price">{product.specialPrice}৳</p>
            </div>
            <p>
              <span>Regular Price: </span>
              {product.regularPrice}৳
            </p>
          </div>
          <div className="product-info-buttons">
            <Button onClick={handleAddToWishlist} disabled={isAddingToWishlist || product.price === "Out Of Stock"}>
              {isAddingToWishlist ? "Adding..." : "Add To Wishlist"}
            </Button>
            <Button onClick={handleAddToCompare} disabled={isAddingToCompare || product.price === "Out Of Stock"}>
              {isAddingToCompare ? "Adding..." : "Add To Compare"}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <table className="attribute-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(product.attributes).map(([key, value]) => (
              <tr key={key}>
                <td className="key">{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;

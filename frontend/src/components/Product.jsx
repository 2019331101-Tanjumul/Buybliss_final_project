// frontend/src/components/Product.jsx

import { Link } from "react-router";
import { Button } from "./ui/Button";
import { useUserStorage } from "../hooks/useLocalStorage";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useCompareStorage } from "../hooks/useCompareStorage";
import { addToWishlist, fetchProductDetails } from "../utils/actions";
import { useState } from "react";

const Product = ({ imageUrl, title, price, discount, company, productDetailsLink, setShowLogin }) => {
  const { getUser } = useUserStorage();
  const { updateWishlistCount } = useWishlist();
  const { updateCompareCount } = useCompare();
  const { addProduct } = useCompareStorage();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);
  const productId = productDetailsLink.split("/").pop();

  const handleAddToWishlist = async () => {
    const user = getUser();
    if (!user) {
      setShowLogin(true);
      return;
    }
    setIsAddingToWishlist(true);
    try {
      await addToWishlist(productId, price, company, user.email);
      updateWishlistCount();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    }
    setIsAddingToWishlist(false);
  };

  const handleAddToCompare = async () => {
    setIsAddingToCompare(true);
    try {
      const product = await fetchProductDetails(productId);
      addProduct(product, `${company}${productDetailsLink.split("/").pop()}`);
      updateCompareCount();
    } catch (error) {
      console.error("Error adding to compare:", error);
    }
    setIsAddingToCompare(false);
  };

  return (
    <article className="product">
      <span className="company">{company}</span>
      <div className="product-img-container">
        <Link to={`/product-details/${productDetailsLink.split("/").pop()}`} target="_blank">
          <img src={imageUrl} alt={title} className="product-img" />
        </Link>
      </div>
      <div className="product-content-container">
        <div className="product-content">
          <h2 className="title">{title}</h2>
          <div>
            <p className="price">
              {price}
              {Number(price) ? "৳" : ""}
            </p>
            {discount && price != "Out Of Stock" && <p className="discount">{`${discount}`}</p>}
          </div>
          <div className="product-buttons">
            <Button onClick={handleAddToWishlist} disabled={isAddingToWishlist || price === "Out Of Stock"}>
              {isAddingToWishlist ? "Adding..." : "Add To Wishlist"}
            </Button>
            <Button onClick={handleAddToCompare} disabled={isAddingToCompare || price === "Out Of Stock"}>
              {isAddingToCompare ? "Adding..." : "Add To Compare"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Product;

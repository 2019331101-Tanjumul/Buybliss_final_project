// frontend/src/components/Product.jsx

import { Link, useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useCompareStorage } from "../hooks/useCompareStorage";
import { addToWishlist, fetchProductDetails } from "../utils/actions";
import { useState } from "react";
import { CompanyLogo } from "./CompanyLogo";
import { ProductImage } from "./ProductImage";
import { useAuth } from "../context/AuthContext";

const Product = ({ imageUrl, title, price, discount, company, productDetailsLink }) => {
	const navigate = useNavigate();
	const { updateWishlistCount } = useWishlist();
	const { updateCompareCount } = useCompare();
	const { addProduct } = useCompareStorage();
	const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
	const [isAddingToCompare, setIsAddingToCompare] = useState(false);
	const { user } = useAuth();

	const handleAddToWishlist = async () => {
		if (!user) {
			navigate("/login");
			return;
		}
		setIsAddingToWishlist(true);
		try {
			await addToWishlist(productDetailsLink, price, company, user.email);
			updateWishlistCount(user.email);
		} catch (error) {
			alert(error.response?.data?.message || "Failed to add to wishlist");
		}
		setIsAddingToWishlist(false);
	};

	const handleAddToCompare = async () => {
		setIsAddingToCompare(true);
		try {
			const product = await fetchProductDetails(productDetailsLink, company);
			addProduct({ ...product, productDetailsLink }, `${productDetailsLink}`);
			updateCompareCount();
		} catch (error) {
			console.error("Error adding to compare:", error);
		}
		setIsAddingToCompare(false);
	};

	return (
		<article className="product">
			<div className="product-img-container">
				<span className="company">
					<CompanyLogo company={company} />
					<span>{company}</span>
				</span>
				{/* <Link to={`/product-details/${productDetailsLink.split("/").pop()}`} target="_blank">
          <img src={imageUrl} alt={title} className="product-img" />
        </Link> */}
				<a href={`${productDetailsLink}`} target="_blank">
					<ProductImage title={title} imageUrl={imageUrl} company={company} />
				</a>
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

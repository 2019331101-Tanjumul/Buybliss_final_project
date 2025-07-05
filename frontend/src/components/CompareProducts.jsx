import { useCompareStorage } from "../hooks/useCompareStorage";
import { Button } from "./ui/Button";
import { comparisonTable } from "../utils/comparisonTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCompare } from "../context/CompareContext";
import { CompanyLogo } from "./CompanyLogo";
import { ProductImage } from "./ProductImage";
import { addToWishlist } from "../utils/actions";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const CompareProducts = () => {
	const navigate = useNavigate();
	const { getProducts, removeProduct, clearAll } = useCompareStorage();
	const { updateCompareCount } = useCompare();
	const [products, setProducts] = useState([]);
	const [loadingProductKey, setLoadingProductKey] = useState(null);
	const comparableAttributes = comparisonTable(products);
	const { updateWishlistCount } = useWishlist();
	const { user } = useAuth();

	useEffect(() => {
		setProducts(getProducts());
	}, [getProducts]);

	const handleAddToWishlist = async (productDetailsLink, price, company, key) => {
		if (!user) {
			navigate("/login");
			return;
		}

		setLoadingProductKey(key);

		try {
			await addToWishlist(productDetailsLink, price, company, user.email);
			await updateWishlistCount(user.email);
		} catch (error) {
			alert(error.response?.data?.message || "Failed to add to wishlist");
		} finally {
			setLoadingProductKey(null);
		}
	};

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
							<th key={product.key}>
								<a href={product.productDetailsLink} target="_blank">
									<div className="compared-product">
										<span className="company">
											<CompanyLogo company={product.company} />
											<span>{product.company}</span>
										</span>
										<ProductImage title={product.title} imageUrl={product.imageUrls[0]} company={product.company} />
										<div className="compared-product-content">
											{product.specialPrice !== "Out Of Stock" ? (
												<p className="special-price">Special Price: {product.specialPrice}৳</p>
											) : (
												<p className="special-price">Special Price: </p>
											)}
											<p>Regular Price: {product.regularPrice}৳</p>
											<h2>{product.title}</h2>
										</div>
										<Button
											className="close-modal-btn"
											onClick={() => {
												removeProduct(`${product.key}`);
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
										<Button
											onClick={() => {
												handleAddToWishlist(
													product.productDetailsLink,
													isNaN(!product.specialPrice) ? product.specialPrice : product.regularPrice,
													product.company,
													product.key
												);
											}}
											disabled={loadingProductKey === product.key || product.regularPrice === "Out Of Stock"}
										>
											Add To Wishlist
										</Button>
									</div>
								</a>
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

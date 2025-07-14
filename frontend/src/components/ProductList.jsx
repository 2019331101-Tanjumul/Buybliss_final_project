import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import Product from "./Product";
import { Button } from "../components/ui/Button";

import "react-loading-skeleton/dist/skeleton.css";
import { fetchProducts } from "../utils/actions";
import { Spinner } from "./ui/Spinner";
import { SortIcon } from "./ui/SortIcon";
import { useCompareStorage } from "../hooks/useCompareStorage";
import { useCompare } from "../context/CompareContext";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const ProductList = () => {
	const { clearAll } = useCompareStorage();
	const { compareCount, updateCompareCount } = useCompare();
	const navigate = useNavigate();
	const [allProducts, setAllProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortAsc, setSortAsc] = useState(true);
	const [stockFilter, setStockFilter] = useState("all");
	const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000000]); // Default range
	const [productsPerPage, setProductsPerPage] = useState(20);
	const sortButtonText = sortAsc ? "Low To High" : "High To Low";
	const [visitedNext, setVisitedNext] = useState(false);

	const fetchedScraperPagesRef = useRef(new Set());

	const { searchKey, currentPage } = useParams();
	const page = Number(currentPage);

	const lastSearchKeyRef = useRef(searchKey);
	const offsetIndex = useMemo(() => (page - 1) * productsPerPage, [page, productsPerPage]);

	useEffect(() => {
		// Reset all when search key changes
		if (lastSearchKeyRef.current !== searchKey) {
			// console.log("searchKey does not match");
			lastSearchKeyRef.current = searchKey;
			setAllProducts([]);
			setStockFilter("all");
			setSelectedPriceRange([0, 1000000]);
			setProductsPerPage(20);
			fetchedScraperPagesRef.current = new Set();
			navigate(`/products/${searchKey}/1`, { replace: true });
		}

		// Fetch page in background if not already fetched
		if (!fetchedScraperPagesRef.current.has(page)) {
			fetchProducts(searchKey, page).then((products) => {
				if (Array.isArray(products)) {
					setAllProducts((prev) => [...prev, ...products]);
					fetchedScraperPagesRef.current.add(page);
				}
			});

			if (page === 1) {
				setLoading(true);
				fetchProducts(searchKey, page)
					.then((response) => {
						setAllProducts(response || []);
						const prices = (response || []).map((p) => p.price).filter((p) => typeof p === "number");
						if (prices.length > 0) {
							const min = Math.min(...prices);
							const max = Math.max(...prices);
							setSelectedPriceRange([min, max]);
						}
					})
					.finally(() => setLoading(false));
				return;
			}
		}
	}, [searchKey, page]);

	useEffect(() => {
		if (page > 1) {
			setLoading(true);
			const timeout = setTimeout(() => setLoading(false), 3000);
			return () => clearTimeout(timeout);
		} else if (visitedNext && page === 1) {
			setLoading(true);
			const timeout = setTimeout(() => setLoading(false), 3000);
			return () => clearTimeout(timeout);
		}
	}, [page, visitedNext]);

	const currentVisibleProducts = useMemo(() => {
		const paginated = allProducts.slice(offsetIndex, offsetIndex + productsPerPage);

		return paginated.filter((p) => {
			const isStock = typeof p.price === "number";
			if (stockFilter === "in") return isStock;
			if (stockFilter === "out") return !isStock;
			return true; // stockFilter === "all"
		});
	}, [allProducts, offsetIndex, productsPerPage, stockFilter]);

	const priceBounds = useMemo(() => {
		const prices = currentVisibleProducts.map((p) => p.price).filter((p) => typeof p === "number");

		if (prices.length === 0) return [0, 0];

		const min = Math.min(...prices);
		const max = Math.max(...prices);

		// Clamp selected range to new bounds if needed
		if (selectedPriceRange[0] < min || selectedPriceRange[1] > max) {
			setSelectedPriceRange([min, max]);
		}

		return [min, max];
	}, [currentVisibleProducts, selectedPriceRange]);

	const products = useMemo(() => {
		const filtered = currentVisibleProducts.filter((p) => {
			const isStock = typeof p.price === "number";
			const [min, max] = selectedPriceRange;

			if (stockFilter === "in") {
				// Show only in-stock within price range
				return isStock && p.price >= min && p.price <= max;
			}

			if (stockFilter === "out") {
				// Show only out-of-stock (price missing or not a number)
				return !isStock;
			}

			// For 'all': show in-stock within range, plus out-of-stock always
			if (stockFilter === "all") {
				return (isStock && p.price >= min && p.price <= max) || !isStock;
			}

			return false;
		});

		const sorted = [...filtered].sort((a, b) => {
			const aStock = typeof a.price === "number";
			const bStock = typeof b.price === "number";

			// Always push out-of-stock items to the bottom
			if (!aStock && bStock) return 1;
			if (aStock && !bStock) return -1;

			// Sort by price if both are in stock
			return sortAsc ? a.price - b.price : b.price - a.price;
		});

		return sorted;
	}, [currentVisibleProducts, selectedPriceRange, stockFilter, sortAsc]);

	const handlePageChange = (newPage) => {
		if (newPage < 1 || offsetIndex + productsPerPage > allProducts.length) return;
		navigate(`/products/${searchKey}/${newPage}`);
	};

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
			) : (
				<>
					<div className="filter-sort">
						<div className="stock-filter">
							<label>
								<input
									type="radio"
									value="all"
									name="all"
									checked={stockFilter === "all"}
									onChange={() => setStockFilter("all")}
								/>{" "}
								All
							</label>
							<label>
								<input
									type="radio"
									value="in"
									name="in stock"
									checked={stockFilter === "in"}
									onChange={() => setStockFilter("in")}
								/>{" "}
								In Stock
							</label>
							<label>
								<input
									type="radio"
									value="out"
									name="out of stock"
									checked={stockFilter === "out"}
									onChange={() => setStockFilter("out")}
								/>{" "}
								Out of Stock
							</label>
						</div>
						<div className="price-filter">
							<p>
								Price Range: {selectedPriceRange[0]}৳ - {selectedPriceRange[1]}৳
							</p>
							<Slider
								range
								min={priceBounds[0]}
								max={priceBounds[1]}
								value={selectedPriceRange}
								onChange={setSelectedPriceRange}
								allowCross={false}
								pushable
								className="price-slider"
							/>
						</div>
						<div className="pagination-filter">
							<p>Show</p>
							<select
								name="products_per_page"
								value={productsPerPage}
								onChange={(e) => {
									setProductsPerPage(Number(e.target.value));
									setLoading(true);
									setTimeout(() => {
										setLoading(false);
									}, 1500);
								}}
							>
								<option value={20} name="twenty_products_per_page">
									20
								</option>
								<option value={30} name="thirty_products_per_page">
									30
								</option>
								<option value={50} name="fifty_products_per_page">
									50
								</option>
							</select>
						</div>
						<Button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
							Price: {sortButtonText}
							<SortIcon />
						</Button>
						<Button
							onClick={() => {
								clearAll();
								updateCompareCount();
							}}
							disabled={compareCount === 0}
						>
							Clear Compare
						</Button>
					</div>
					<section className="product-list">
						{products.length === 0 ? (
							<p>No product left</p>
						) : (
							products.map((product) => <Product key={product.productDetailsLink} {...product} />)
						)}
					</section>
					<div className="pagination">
						<Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
							Previous
						</Button>
						<Button
							onClick={() => {
								handlePageChange(page + 1);
								setVisitedNext(true);
							}}
							disabled={offsetIndex + productsPerPage >= allProducts.length}
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

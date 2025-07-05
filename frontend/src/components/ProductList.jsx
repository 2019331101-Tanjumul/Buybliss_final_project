import { useEffect, useMemo, useState } from "react";
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

const ProductList = () => {
	const { clearAll } = useCompareStorage();
	const { compareCount, updateCompareCount } = useCompare();
	const navigate = useNavigate();
	const [allProducts, setAllProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortAsc, setSortAsc] = useState(true);
	const [stockFilter, setStockFilter] = useState("all");
	const sortButtonText = sortAsc ? "Low To High" : "High To Low";

	const { searchKey, currentPage } = useParams();
	const page = Number(currentPage);

	useEffect(() => {
		setLoading(true);
		fetchProducts(searchKey, page)
			.then((response) => {
				setAllProducts(response || []);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [searchKey, page]);

	const filteredAndSortedProducts = useMemo(() => {
		const filtered = allProducts.filter((p) => {
			const isStock = typeof p.price === "number";
			if (stockFilter === "in") return isStock;
			if (stockFilter === "out") return !isStock;
			return true;
		});

		const sorted = [...filtered].sort((a, b) => {
			const isAStock = typeof a.price === "number";
			const isBStock = typeof b.price === "number";

			if (!isAStock && isBStock) return 1;
			if (isAStock && !isBStock) return -1;
			if (!isAStock && !isBStock) return 0;

			return sortAsc ? a.price - b.price : b.price - a.price;
		});

		return sorted;
	}, [allProducts, sortAsc, stockFilter]);

	const handlePageChange = (newPage) => {
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
						{filteredAndSortedProducts.length === 0 ? (
							<p>No product left</p>
						) : (
							filteredAndSortedProducts.map((product) => (
								<Product key={product.productDetailsLink} {...product} />
							))
						)}
					</section>
					<div className="pagination">
						<Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
							Previous
						</Button>
						<Button
							onClick={() => {
								handlePageChange(page + 1);
							}}
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

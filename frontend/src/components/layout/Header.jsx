import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { useWishlist } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";
import SearchInput from "../ui/SearchInput";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
	const navigate = useNavigate();
	const { wishlistCount, clearWishlistCount } = useWishlist();
	const { compareCount } = useCompare();
	const { user, logout } = useAuth();
	const location = useLocation();

	async function handleLogout() {
		await logout();
		clearWishlistCount();
		if (location.pathname === "/wishlist") {
			navigate("/");
		}
	}

	return (
		<header>
			<h1 className="logo">
				<Link to={"/"}>
					buy<span>bliss</span>
				</Link>
			</h1>
			{location.pathname !== "/" && <SearchInput />}
			<nav>
				<Link to={"/compare-products"} className="compare-link">
					<div className="compare-container">
						<svg
							height="1.5rem"
							width="1.5rem"
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							viewBox="0 0 511.998 511.998"
							xmlSpace="preserve"
							stroke="#000000"
							strokeWidth="1.5"
						>
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<g>
									<path
										// fill="#000000;"
										d="M123.182,272.455c4.453,4.453,10.404,6.819,16.461,6.819c2.998,0,6.021-0.58,8.899-1.773 c8.696-3.601,14.367-12.088,14.367-21.501v-93.09h325.816c12.853,0,23.273-10.42,23.273-23.273 c0-12.853-10.42-23.273-23.273-23.273H162.91v-93.09c0-9.411-5.669-17.898-14.367-21.501c-8.696-3.604-18.708-1.612-25.361,5.044 L6.819,123.18c-9.089,9.089-9.089,23.823,0,32.912L123.182,272.455z"
									></path>
									<path
										// fill="#000000;"
										d="M388.818,239.543c-6.656-6.658-16.666-8.648-25.362-5.046c-8.696,3.603-14.367,12.089-14.367,21.501 v93.09H23.273C10.42,349.089,0,359.509,0,372.361c0,12.853,10.42,23.273,23.273,23.273h325.816v93.09 c0,9.413,5.669,17.9,14.367,21.501c2.878,1.193,5.903,1.773,8.899,1.773c6.057,0,12.01-2.364,16.461-6.819L505.18,388.817 c9.089-9.087,9.089-23.822,0-32.912L388.818,239.543z"
									></path>
								</g>
							</g>
						</svg>
						{compareCount > 0 && <span className="compare-count">{compareCount}</span>}
					</div>
				</Link>
				<Link to={user ? "/wishlist" : "/"} className="wishlist-link">
					<div className="wishlist-container">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.5rem"
							height="1.5rem"
							viewBox="0 0 24 24"
							role="img"
							aria-labelledby="favouriteIconTitle"
							stroke="#000000"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
							color="#000000"
							className="wishlist"
						>
							<title id="favouriteIconTitle">Wishlist</title>
							<path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z" />
						</svg>
						{wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
					</div>
				</Link>
				{user ? (
					<Button className="logout-btn" onClick={handleLogout}>
						Logout
					</Button>
				) : (
					<Button
						className="login-btn"
						onClick={() => {
							navigate("/login");
						}}
					>
						Login
					</Button>
				)}
			</nav>
		</header>
	);
};

export default Header;

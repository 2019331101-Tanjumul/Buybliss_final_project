import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Wishlist from "./components/Wishlist";
import CompareProducts from "./components/CompareProducts";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { VerifyEmailWithToken } from "./components/VerifyEmailWithToken";

import "./App.css";
import { VerifyEmail } from "./components/VerifyEmail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Spinner } from "./components/ui/Spinner";

function AuthWrapper() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Spinner />;
	}

	// TODO: refresh-session, price-filter, pagination

	return (
		<WishlistProvider user={user}>
			<CompareProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
						<Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
						<Route
							path="/verify"
							element={
								!user ? (
									<Navigate to="/login" replace />
								) : user.isVerified ? (
									<Navigate to="/" replace />
								) : (
									<VerifyEmail email={user.email} />
								)
							}
						/>
						<Route
							path="/verify-email"
							element={
								!user ? (
									<Navigate to="/login" replace />
								) : user.isVerified ? (
									<Navigate to="/" replace />
								) : (
									<VerifyEmailWithToken />
								)
							}
						/>

						<Route path="/" element={<AppLayout />}>
							<Route index element={<Home />} />
							<Route path="/products/:searchKey/:currentPage" element={<ProductList />} />
							<Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" />} />
							<Route path="/product-details/:productId" element={<ProductDetails />} />
							<Route path="/compare-products" element={<CompareProducts />} />
						</Route>

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</BrowserRouter>
			</CompareProvider>
		</WishlistProvider>
	);
}

function App() {
	return (
		<AuthProvider>
			<AuthWrapper />
		</AuthProvider>
	);
}

export default App;

import { Outlet } from "react-router";
import Header from "./Header";
import { Login } from "../Login";
import Footer from "./Footer";

const AppLayout = () => {
	return (
		<main>
			<Header />
			<div className="container">
				<Outlet />
			</div>
			<Footer />
		</main>
	);
};

export default AppLayout;

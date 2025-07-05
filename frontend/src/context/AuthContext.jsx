// hooks/useAuth.js
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutFromDB } from "../utils/actions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getCurrentUser();
				setUser(data.user);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	async function logout() {
		await logoutFromDB();
		setUser(null);
	}

	return <AuthContext.Provider value={{ user, setUser, loading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

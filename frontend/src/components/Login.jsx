import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../utils/actions";
import { useWishlist } from "../context/WishlistContext";
import { loginSchema } from "../schemas/loginSchema";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
	const { setUser } = useAuth();
	const { updateWishlistCount } = useWishlist();
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const onSubmit = async ({ email, password }) => {
		try {
			setError("");
			const data = await login(email, password);

			if (data?.user?.email) {
				if (!data.user.isVerified) {
					navigate("/verify", { replace: true });
				}
				setUser(data.user);
				await updateWishlistCount();
				navigate("/", { replace: true });
			} else {
				setError("Unexpected error occurred");
			}
		} catch (err) {
			// Axios-specific error handling
			if (err.response?.status === 401) {
				setError("Invalid email or password.");
			} else if (err.response?.data?.error) {
				setError(err.response.data.error);
			} else {
				setError("Something went wrong. Please try again.");
			}

			console.log("login error:", err);
		}
	};

	return (
		<form className="logged" onSubmit={handleSubmit(onSubmit)} onClick={(event) => event.stopPropagation()}>
			<div>
				<h1>Log In</h1>
				<p>By logging in, you agree to our Privacy Policy and consent to receive emails.</p>
			</div>
			<div>
				<article>
					<input type="email" placeholder="Enter Email" autoComplete="email" {...register("email")} />
					<p className="error">{errors.email?.message}</p>
				</article>
				<article>
					<input
						type="password"
						placeholder="Enter Password"
						autoComplete="current-password"
						{...register("password")}
					/>
					<p className="error">{errors.password?.message}</p>
				</article>
			</div>

			<article className="server-error">
				{error && <p className="error">{error}</p>}
				<button type="submit" disabled={isSubmitting || errors.email?.message || errors.password?.message}>
					{isSubmitting ? "Loading ..." : <>Login</>}
				</button>
				<h2 className="forget">forget password</h2>
			</article>

			<p>
				Do not have an account?
				<Link to={"/signup"} replace>
					Signup
				</Link>
			</p>
		</form>
	);
};

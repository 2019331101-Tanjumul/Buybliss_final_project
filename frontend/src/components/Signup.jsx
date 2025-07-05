import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../utils/actions";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import { Link } from "react-router";
import { signupSchema } from "../schemas/signupSchema";
import { VerifyEmail } from "./VerifyEmail";

export const Signup = () => {
	const { updateWishlistCount } = useWishlist();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [emailToVerify, setEmailToVerify] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signupSchema),
		mode: "onChange",
	});

	const onSubmit = async ({ email, password }) => {
		try {
			setError("");

			const data = await signup(email, password);

			if (data?.user?.email) {
				setEmailToVerify(data.user.email);
				setSuccess(true);
				await updateWishlistCount();
			} else {
				setError("Unexpected error occurred");
			}
		} catch (err) {
			// Axios-specific error handling
			if (err.response?.status === 401) {
				setError("Email already in use or invalid credentials.");
			} else if (err.response?.data?.error) {
				setError(err.response.data.error);
			} else {
				setError("Something went wrong. Please try again.");
			}

			console.log("signup error:", err);
		}
	};

	if (success) {
		return <VerifyEmail email={emailToVerify} />;
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} onClick={(event) => event.stopPropagation()}>
			<div>
				<h1>Sign Up</h1>
				<p>By signin up, you agree to our Privacy Policy and consent to receive emails.</p>
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

				<article>
					<input
						type="password"
						placeholder="Confirm Password"
						autoComplete="new-password"
						{...register("confirmPassword")}
					/>
					<p className="error">{errors.confirmPassword?.message}</p>
				</article>
			</div>

			<article className="server-error">
				{error && <p className="error">{error}</p>}
				<button
					type="submit"
					disabled={
						isSubmitting || errors.email?.message || errors.password?.message || errors.confirmPassword?.message
					}
				>
					{isSubmitting ? "Loading ..." : <>Signup</>}
				</button>
			</article>

			<p>
				Already have an account?{" "}
				<Link to={"/login"} replace>
					Login
				</Link>
			</p>
		</form>
	);
};

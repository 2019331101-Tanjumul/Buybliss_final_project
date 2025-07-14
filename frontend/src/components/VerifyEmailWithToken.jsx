import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { resendVerificationEmail, verifyEmail } from "../utils/actions";
import { Button } from "./ui/Button";

export const VerifyEmailWithToken = () => {
	const [status, setStatus] = useState("verifying");
	const [message, setMessage] = useState("");
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [countDown, setCountDown] = useState(0); // seconds

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			setMessage("Invalid verification link.");
			return;
		}

		const verifyToken = async () => {
			try {
				const response = await verifyEmail(token);
				setStatus("success");
				setMessage(response.message || "Email verified successfully.");
				// Optional: redirect to login page after delay
				setTimeout(() => navigate("/login", { replace: true }), 3000);
			} catch (error) {
				setStatus("error");
				if (error.response?.data?.error) {
					setMessage(error.response.data.error);
				} else {
					setMessage("Verification failed. Please try again.");
				}
				console.log("verify email error:", error);
			}
		};

		verifyToken();
	}, [searchParams, navigate]);

	// Countdown timer
	useEffect(() => {
		if (countDown > 0) {
			const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countDown]);

	const handleResend = async () => {
		try {
			await resendVerificationEmail();
			setCountDown(60);
		} catch (err) {
			console.error("Resend failed:", err);
		}
	};

	return (
	// 	<div className="verify-email">
	// 		<h1>Email Verification</h1>

	// 		{status === "verifying" && <p>Verifying your email...</p>}

	// 		{status === "success" && (
	// 			<div className="success-message">
	// 				<p>{message}</p>
	// 				<p>Redirecting to login...</p>
	// 			</div>
	// 		)}

	// 		{status === "error" && (
	// 			<div className="error-message">
	// 				<p>{message}</p>
	// 				<p>
	// 					Need help?
	// 					<Button onClick={handleResend}>
	// 						{countDown ? `Wait ${countDown} seconds before trying again` : "Resend verification Email"}
	// 					</Button>
	// 				</p>
	// 			</div>
	// 		)}
	// 	</div>
	// );

	<div className="verify-email-container">
	<div className="verify-email-card">
		<h1>Email Verification</h1>

		{status === "verifying" && <p>Verifying your email...</p>}

		{status === "success" && (
			<div className="success-message">
				<p>{message}</p>
				<p>Redirecting to login...</p>
			</div>
		)}

		{status === "error" && (
			<div className="error-message">
				<p>{message}</p>
				<p>
					Need help?
					<Button onClick={handleResend} disabled={countDown > 0}>
						{countDown ? `Wait ${countDown} seconds before trying again`: "Resend Verification Email"}
					</Button>
				</p>
			</div>
		)}
	</div>
</div>

	);
};

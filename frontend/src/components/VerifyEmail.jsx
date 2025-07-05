import { useEffect, useState } from "react";
import { resendVerificationEmail } from "../utils/actions";
import { Button } from "./ui/Button";

export const VerifyEmail = () => {
	const [countDown, setCountDown] = useState(0); // seconds

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
			setCountDown(60); // Start 1-minute countDown
		} catch (err) {
			console.error("Resend failed:", err);
		}
	};

	return (
		<div className="verify-email">
			<p>An email verification link is send to your email. Please follow the link to proceed further.</p>
			<p>Do not receive a link?</p>
			<Button onClick={handleResend} disabled={countDown !== 0}>
				{countDown ? `Wait ${countDown} seconds before trying again` : "Resend verification Email"}
			</Button>
		</div>
	);
};

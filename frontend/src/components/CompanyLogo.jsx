export const CompanyLogo = ({ company }) => {
	return (
		<div>
			{company === "Ryans" && <img src="/ryans-logo.svg" alt="company logo" className="company-logo" />}
			{company === "StarTech" && <img src="/star-tech-logo.png" alt="company logo" className="company-logo" />}
			{company === "TechLandBD" && <img src="/techland-logo.png" alt="company logo" className="company-logo" />}
			{company === "AppleGadgets" && <img src="/applegadgets-logo.png" alt="company logo" className="company-logo" />}
			{company === "BinaryLogic" && <img src="/binary-logic-logo.webp" alt="company logo" className="company-logo" />}
			{company === "SkyLandBD" && <img src="/skyland-logo.webp" alt="company logo" className="company-logo" />}
			{company === "UCC" && <img src="/ucc-logo.webp" alt="company logo" className="company-logo" />}
			{company === "GlobalBrand" && <img src="/global-brand-logo.svg" alt="company logo" className="company-logo" />}
			{company === "UltraTech" && <img src="/ultra-tech-logo.png.webp" alt="company logo" className="company-logo" />}
			{company === "Diamu" && <img src="/diamu-logo.webp" alt="company logo" className="company-logo" />}
			{company === "CreatusComputerBD" && (
				<img src="/creatus-computer-logo.webp" alt="company logo" className="company-logo" />
			)}
		</div>
	);
};

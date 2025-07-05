export const ProductImage = ({ company, imageUrl, title }) => {
	const isProxyCompany = ["BinaryLogic", "SkyLandBD"].includes(company);

	return (
		<>
			{imageUrl !== "" ? (
				<img
					src={
						isProxyCompany ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}` : imageUrl
					}
					alt={title}
					className="product-img"
					loading="lazy"
				/>
			) : (
				<img src="" alt={title} className="product-img" />
			)}
		</>
	);
};

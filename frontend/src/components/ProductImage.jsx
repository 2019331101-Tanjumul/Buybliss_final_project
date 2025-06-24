export const ProductImage = ({company, imageUrl, title}) => {
	return (
		<>
			{company === "BinaryLogic" ? (
				<img
					src={`https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`}
					alt={title}
					className="product-img"
				/>
			) : (
				<img src={imageUrl} alt={title} className="product-img" />
			)}
		</>
	);
};

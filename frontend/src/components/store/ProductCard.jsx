const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="card group overflow-hidden">
            {/* Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-dark-surface">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                )}
                {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary/90 text-white text-xs font-medium rounded-full">
                        {product.category.name}
                    </span>
                )}
            </div>

            {/* Details */}
            <h3 className="font-semibold text-text-primary mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-text-muted mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-primary">${product.price?.toFixed(2)}</span>
                <button
                    onClick={() => onAddToCart?.(product.id)}
                    className="btn-primary !py-2 !px-4 !text-sm"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

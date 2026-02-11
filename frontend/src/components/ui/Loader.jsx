const Loader = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <svg
                className={`animate-spin text-primary ${sizes[size]}`}
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    );
};

// Skeleton loader for content placeholders
export const Skeleton = ({ className = '', lines = 1 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
                />
            ))}
        </div>
    );
};

export const CardSkeleton = () => (
    <div className="card">
        <div className="skeleton h-40 w-full mb-4" />
        <div className="skeleton h-5 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-4" />
        <div className="skeleton h-10 w-full" />
    </div>
);

export default Loader;

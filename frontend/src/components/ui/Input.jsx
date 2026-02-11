import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl 
          text-text-primary placeholder-text-muted
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
          transition-all duration-200 ${error ? 'border-danger' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

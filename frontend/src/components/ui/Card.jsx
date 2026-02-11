const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`card ${hover ? '' : '!transform-none !shadow-none hover:!border-dark-border'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;

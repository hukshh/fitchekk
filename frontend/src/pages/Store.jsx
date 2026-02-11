import { useState, useEffect, useCallback, useContext } from 'react';
import { useApi } from '../hooks/useApi';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';
import { CardSkeleton } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { HiSearch, HiX, HiShoppingCart, HiTrash, HiMinus, HiPlus } from 'react-icons/hi';

const Store = () => {
    const { get, post, put, del } = useApi();
    const { items: cartItems, total: cartTotal, count: cartCount, setCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [ordering, setOrdering] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (activeCategory) params.set('category', activeCategory);
            const res = await get(`/products?${params}`);
            setProducts(res.products || []);
        } catch (err) { toast.error(err.message); }
    }, [get, search, activeCategory]);

    const fetchCart = useCallback(async () => {
        try {
            const res = await get('/cart');
            setCart(res);
        } catch (err) { console.error(err); }
    }, [get, setCart]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await get('/products/categories');
            setCategories(res.categories || []);
        } catch (err) { console.error(err); }
    }, [get]);

    useEffect(() => {
        Promise.all([fetchProducts(), fetchCart(), fetchCategories()]).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => { fetchProducts(); }, 300);
        return () => clearTimeout(timer);
    }, [search, activeCategory, fetchProducts]);

    const handleAddToCart = async (productId) => {
        try {
            await post('/cart', { productId });
            toast.success('Added to cart!');
            fetchCart();
        } catch (err) { toast.error(err.message); }
    };

    const handleUpdateQty = async (itemId, qty) => {
        try {
            if (qty < 1) { await del(`/cart/${itemId}`); }
            else { await put(`/cart/${itemId}`, { quantity: qty }); }
            fetchCart();
        } catch (err) { toast.error(err.message); }
    };

    const handleCheckout = async () => {
        if (!shippingAddress.trim() || shippingAddress.length < 5) { toast.error('Enter a valid shipping address'); return; }
        setOrdering(true);
        try {
            await post('/orders', { shippingAddress });
            toast.success('Order placed successfully! 🎉');
            setCheckoutOpen(false);
            setCartOpen(false);
            setShippingAddress('');
            fetchCart();
        } catch (err) { toast.error(err.message); }
        finally { setOrdering(false); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Store</h1>
                    <p className="text-text-muted mt-1">Premium fitness gear & supplements</p>
                </div>
                <button onClick={() => setCartOpen(true)} className="relative p-3 bg-dark-card border border-dark-border rounded-xl hover:border-primary transition-colors">
                    <HiShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveCategory('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory ? 'bg-primary text-white' : 'bg-dark-card text-text-secondary border border-dark-border hover:border-primary'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.name ? 'bg-primary text-white' : 'bg-dark-card text-text-secondary border border-dark-border hover:border-primary'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="card text-center py-16">
                    <HiSearch className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-text-muted">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}

            {/* Cart Sidebar */}
            {cartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-dark-card border-l border-dark-border h-full overflow-y-auto animate-slide-right"
                        style={{ animationDirection: 'reverse', animationName: 'none', transform: 'translateX(0)' }}
                        onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Cart ({cartCount})</h2>
                                <button onClick={() => setCartOpen(false)} className="p-1 text-text-muted hover:text-text-primary">
                                    <HiX className="w-6 h-6" />
                                </button>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <HiShoppingCart className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                    <p className="text-text-muted">Your cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 p-3 bg-dark-surface rounded-xl">
                                                <div className="w-16 h-16 rounded-lg bg-dark-card overflow-hidden flex-shrink-0">
                                                    {item.product?.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">IMG</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.product?.name}</p>
                                                    <p className="text-sm text-primary font-semibold">${item.product?.price?.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                                                        {item.quantity === 1 ? <HiTrash className="w-3.5 h-3.5" /> : <HiMinus className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                                                        <HiPlus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-dark-border pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-text-secondary">Total</span>
                                            <span className="text-2xl font-bold">${cartTotal?.toFixed(2)}</span>
                                        </div>
                                        <Button onClick={() => { setCheckoutOpen(true); }} className="w-full justify-center">
                                            Checkout
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {checkoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setCheckoutOpen(false)}>
                    <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Checkout</h2>
                        <p className="text-sm text-text-muted mb-1">Order Total</p>
                        <p className="text-3xl font-bold text-primary mb-6">${cartTotal?.toFixed(2)}</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Shipping Address</label>
                            <textarea
                                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-all resize-none"
                                rows={3}
                                placeholder="123 Fitness St, Gym City, GC 12345"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCheckout} loading={ordering} className="w-full justify-center">
                            Place Order
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Store;

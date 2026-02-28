'use client';

import { useState, useEffect, Suspense } from 'react';
import Shell from '@/components/layout/Shell';
import {
    Warehouse, Package, Search, Filter, CheckCircle2, PlusCircle, Tag, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

function StorehousePageInner() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<any[]>([]);
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all products from the global storehouse
            const storeRes = await api.get('/products?limit=1000');
            if (storeRes.success) {
                setProducts(storeRes.data || []);
            }
            // Fetch the products the seller has already added
            const myRes = await api.get('/products/my-products?limit=10000');
            if (myRes.success) {
                const ids = new Set<string>((myRes.data || []).map((p: any) => String(p._id || p.id)));
                setAddedProductIds(ids);
            }
        } catch (error) {
            console.error('Failed to fetch storehouse data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleAddToStore = async (product: any) => {
        setAddingId(product._id);
        try {
            const res = await api.post('/products/add-to-store', { product_id: product._id });
            if (res.success) {
                setAddedProductIds(prev => new Set([...prev, String(product._id)]));
            } else {
                alert(res.message || 'Failed to add product');
            }
        } catch (err: any) {
            alert(err.message || 'Error adding product');
        } finally {
            setAddingId(null);
        }
    };

    // Derive categories
    const categoryMap = products.reduce((acc: any, p: any) => {
        const cat = p.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const allCategories = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

    const filteredProducts = products
        .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
        .filter(p => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
        });

    if (authLoading || !user) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

    return (
        <Shell>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <Warehouse className="w-6 h-6 text-primary-500" />
                            Storehouse
                        </h2>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                            Browse &amp; Add Products to Your Store
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <Package className="w-4 h-4 text-primary-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total in Store</span>
                                <span className="text-sm font-black text-gray-900 leading-none mt-1">{products.length}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl shadow-lg">
                            <CheckCircle2 className="w-4 h-4 text-white/80" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/60 uppercase leading-none">Added by You</span>
                                <span className="text-sm font-black text-white leading-none mt-1">{addedProductIds.size}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4 sticky top-24">
                        <div className="glass-card p-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-primary-500" />
                                Categories
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'All' ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <span>All Products</span>
                                    <span className={selectedCategory === 'All' ? 'text-white' : 'text-gray-400'}>{products.length}</span>
                                </button>
                                {allCategories.map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat.name ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <span className="truncate mr-2">{cat.name}</span>
                                        <span className={selectedCategory === cat.name ? 'text-white' : 'text-gray-400'}>{cat.count as number}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-bold"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="glass-card p-20 text-center text-gray-400 flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                                <p className="font-bold">Loading storehouse products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="glass-card p-20 text-center flex flex-col items-center gap-4">
                                <Package className="w-12 h-12 text-gray-200" />
                                <p className="font-bold text-gray-500">No products found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredProducts.map(product => {
                                    const isAdded = addedProductIds.has(String(product._id));
                                    const isAdding = addingId === product._id;
                                    const imgSrc = product.image
                                        ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
                                        : '';

                                    return (
                                        <div
                                            key={product._id}
                                            className={`glass-card overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${isAdded ? 'ring-2 ring-primary-400' : ''}`}
                                        >
                                            {/* Product Image */}
                                            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Tag className="w-10 h-10 text-gray-200" />
                                                )}
                                                {isAdded && (
                                                    <div className="absolute top-2 right-2 bg-primary-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Added
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                    {product.category}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <h4 className="text-sm font-black text-gray-900 leading-tight mb-1 line-clamp-2">{product.name}</h4>
                                                {product.brand && (
                                                    <p className="text-[10px] text-gray-400 font-bold mb-2">{product.brand}</p>
                                                )}

                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Cost</p>
                                                        <p className="text-sm font-black text-gray-700">₹{(product.price || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-primary-500 font-bold uppercase">Selling</p>
                                                        <p className="text-sm font-black text-primary-600">₹{(product.selling_price || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => !isAdded && handleAddToStore(product)}
                                                    disabled={isAdded || isAdding}
                                                    className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                                                        ${isAdded
                                                            ? 'bg-primary-50 text-primary-500 border border-primary-200 cursor-default'
                                                            : 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md hover:shadow-lg active:scale-95'
                                                        }`}
                                                >
                                                    {isAdding ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : isAdded ? (
                                                        <><CheckCircle2 className="w-4 h-4" /> Already Added</>
                                                    ) : (
                                                        <><PlusCircle className="w-4 h-4" /> Add to My Store</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Shell>
    );
}

export default function StorehousePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <StorehousePageInner />
        </Suspense>
    );
}

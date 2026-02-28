'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Plus, Search, Package, CheckCircle2, AlertCircle, Loader2, Tag, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEntries, setShowEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const statsRes = await api.get('/sellers/stats');
            if (statsRes.success) setStats(statsRes.stats);

            // Fetch only this seller's added products
            const response = await api.get('/products/my-products?limit=10000');
            if (response.success) setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Remove "${name}" from your store?`)) return;
        try {
            const res = await api.delete(`/products/from-store/${id}`);
            if (res.success) {
                fetchData();
            } else {
                alert(res.message || 'Failed to remove product');
            }
        } catch (err: any) {
            alert('Error: ' + (err.message || 'Could not remove product'));
        }
    };

    const filtered = products.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
            (p.name || '').toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
    });

    const totalPages = Math.ceil(filtered.length / showEntries);
    const paginated = filtered.slice((currentPage - 1) * showEntries, currentPage * showEntries);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Products</h2>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage Your Store Products</p>
                    </div>
                    <button
                        onClick={() => router.push('/storehouse')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl text-white text-sm font-black shadow-lg hover:shadow-xl active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Products
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Products Count */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                        <p className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-2">Products</p>
                        <p className="text-5xl font-black mb-2">{products.length}</p>
                        <p className="text-sm font-semibold text-blue-200">Remaining Uploads</p>
                        <div className="mt-3 text-2xl font-black text-blue-100">{stats?.remainingProducts ?? '—'}</div>
                    </div>

                    {/* Plan Info */}
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-8 h-8 text-primary-500" />
                        </div>
                        <p className="text-primary-600 font-black text-lg">Current Package: {stats?.planName || 'Free Plan'}</p>
                        <button
                            onClick={() => router.push('/packages')}
                            className="mt-3 px-5 py-1.5 border-2 border-primary-500 text-primary-600 text-sm font-black rounded-xl hover:bg-primary-50 transition-all"
                        >
                            Upgrade Package
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="glass-card p-6 flex flex-col gap-3 justify-center">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase">Total Added</span>
                            <span className="text-lg font-black text-gray-900">{products.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase">Can Add More</span>
                            <span className="text-lg font-black text-primary-600">{stats?.remainingProducts ?? '—'}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <button
                            onClick={() => router.push('/storehouse')}
                            className="w-full py-2 text-sm font-black text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all"
                        >
                            Browse Storehouse →
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="glass-card overflow-hidden">
                    {/* Table Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-50">
                        <h3 className="font-black text-gray-900 text-base">All Products</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-semibold">Show</span>
                                <select
                                    value={showEntries}
                                    onChange={e => { setShowEntries(Number(e.target.value)); setCurrentPage(1); }}
                                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                >
                                    {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <span className="font-semibold">entries</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="font-bold">Loading products...</span>
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                            <Package className="w-12 h-12 text-gray-200" />
                            <p className="font-bold">No products found.</p>
                            <button
                                onClick={() => router.push('/storehouse')}
                                className="mt-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 transition-all"
                            >
                                Go to Storehouse to Add Products
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-10">#</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thumbnail Image</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Selling Price</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginated.map((product, idx) => {
                                        const imgSrc = product.image
                                            ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
                                            : '';
                                        const rowNum = (currentPage - 1) * showEntries + idx + 1;

                                        return (
                                            <tr key={product._id || product.link_id} className="group hover:bg-gray-50/80 transition-all">
                                                <td className="px-4 py-3 text-xs font-black text-gray-400">{rowNum}</td>
                                                <td className="px-4 py-3">
                                                    <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center">
                                                        {imgSrc ? (
                                                            <img
                                                                src={imgSrc}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                                                            />
                                                        ) : (
                                                            <Tag className="w-6 h-6 text-gray-300" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-black text-gray-900 leading-tight line-clamp-2 max-w-[160px]">{product.name}</p>
                                                    {product.brand && (
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{product.brand}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-wide">
                                                        {product.category || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-xs text-gray-500 font-medium line-clamp-2 max-w-[180px]">
                                                        {product.description || 'No description'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-black text-gray-700">₹{(product.price || 0).toLocaleString()}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <p className="text-sm font-black text-primary-600">₹{(product.selling_price || 0).toLocaleString()}</p>
                                                        {product.profit > 0 && (
                                                            <p className="text-[10px] font-bold text-green-500">+₹{product.profit} profit</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end">
                                                        <button
                                                            onClick={() => handleDelete(product.link_id || product._id, product.name)}
                                                            className="p-2 hover:bg-red-50 rounded-xl text-gray-300 hover:text-red-500 transition-all"
                                                            title="Remove from store"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table Footer */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-50">
                            <p className="text-xs text-gray-400 font-semibold">
                                Showing {Math.min((currentPage - 1) * showEntries + 1, filtered.length)}–{Math.min(currentPage * showEntries, filtered.length)} of {filtered.length} products
                            </p>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => currentPage <= 3 ? i + 1 : currentPage - 2 + i).filter(p => p >= 1 && p <= totalPages).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${p === currentPage ? 'bg-primary-500 text-white shadow-md' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    );
}

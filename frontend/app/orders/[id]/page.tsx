'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import {
    ChevronRight,
    Package,
    CreditCard,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Wallet,
    Lock,
    Loader2,
    Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Payment Modal State
    const [showPayModal, setShowPayModal] = useState(false);
    const [transPassword, setTransPassword] = useState('');
    const [payLoading, setPayLoading] = useState(false);
    const [payError, setPayError] = useState('');
    const [paySuccess, setPaySuccess] = useState(false);

    // Wallet Stats
    const [walletStats, setWalletStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Order
                const orderRes = await api.get(`/orders/${id}`);
                if (orderRes) {
                    setOrder(orderRes);
                }

                // Fetch Wallet Stats
                const statsRes = await api.get('/sellers/stats');
                if (statsRes && statsRes.success) {
                    setWalletStats(statsRes.stats);
                }
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePayStorehouse = async () => {
        if (!transPassword) {
            setPayError('Please enter transaction password');
            return;
        }

        setPayLoading(true);
        setPayError('');
        try {
            const response = await api.put(`/orders/${id}/pay-storehouse`, { trans_password: transPassword });
            setPaySuccess(true);
            // Refresh order data after small delay
            setTimeout(() => {
                setShowPayModal(false);
                router.refresh(); // Or fetch again
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            console.error('Payment error:', err);
            setPayError(err.message || 'Payment failed');
        } finally {
            setPayLoading(false);
        }
    };

    if (loading) return (
        <Shell>
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        </Shell>
    );

    if (error || !order) return (
        <Shell>
            <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
                <p className="text-red-600 mb-6">{error || 'Order not found'}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Go Back</button>
            </div>
        </Shell>
    );

    const isPaid = order.payment_status?.toLowerCase() === 'paid';
    const storehouseTotal = parseFloat(order.cost_amount) || 0;
    const orderTotal = parseFloat(order.order_total) || 0;
    const profit = orderTotal - storehouseTotal;

    return (
        <Shell>
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
                {/* Header / Breadcrumbs */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <button onClick={() => router.push('/orders')} className="hover:text-primary-600 transition-colors">Product Order</button>
                            <ChevronRight size={14} />
                            <span className="text-primary-600 font-semibold">Order details</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">Order Details</h1>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm shadow-sm"
                    >
                        <ArrowLeft size={16} /> Back to List
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Customer & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info Card */}
                        <div className="glass-card p-8 group hover:border-primary-500/20 transition-all">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                    <Package size={20} />
                                </div>
                                <h3 className="text-lg font-black text-gray-900">Customer Details</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-2xl font-black text-gray-900 mb-1">{order.customer_name}</p>
                                    <p className="text-gray-500 font-medium">{order.customer_email || 'No email provided'}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                            <p className="font-bold text-gray-900">{order.customer_phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <Truck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                            <p className="font-bold text-gray-900 leading-relaxed">{order.customer_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table Card */}
                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Photo</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(order.orderItems || []).map((item: any) => (
                                        <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                                    {item.product?.image ? (
                                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-gray-900 mb-1">{item.product?.name || 'Unknown Product'}</p>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Product ID: {item.product?._id?.substring(0, 8)}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-900 font-black text-sm">{item.quantity}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-gray-900">₹{parseFloat(item.price).toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Status & Payment */}
                    <div className="space-y-6">
                        {/* Highlights Card */}
                        <div className="glass-card p-8">
                            {!isPaid && (
                                <button
                                    onClick={() => setShowPayModal(true)}
                                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg mb-8 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                                >
                                    Payment for Storehouse
                                </button>
                            )}

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Payment Status</span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isPaid ? 'bg-success-50 text-success-600 border border-success-100' : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                        {order.payment_status || 'unpaid'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Delivery Status</span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                                        ? 'bg-success-50 text-success-600 border border-success-100'
                                        : 'bg-primary-50 text-primary-600 border border-primary-100'
                                        }`}>
                                        {order.status || 'pending'}
                                    </span>
                                </div>
                                <div className="h-px bg-gray-100 w-full" />
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-black text-gray-400">Order #</span>
                                        <span className="text-sm font-black text-primary-600">{order.order_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-black text-gray-400">Order Date</span>
                                        <span className="text-sm font-black text-gray-900">{new Date(order.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-black text-gray-400">Total Amount</span>
                                        <span className="text-sm font-black text-danger-600">₹{parseFloat(order.order_total).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-black text-gray-400">Payment Method</span>
                                        <span className="text-sm font-black text-gray-900 uppercase">{order.payment_method || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-black text-gray-400">Delivery Date</span>
                                        <span className="text-sm font-black text-gray-300">******</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="glass-card p-8 bg-gray-50/50">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Storehouse Price:</span>
                                    <span className="font-bold text-gray-700">₹{storehouseTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Profit:</span>
                                    <span className="font-bold text-success-600">₹{profit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Sub Total:</span>
                                    <span className="font-bold text-gray-700">₹{orderTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Tax:</span>
                                    <span className="font-bold text-gray-700">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Shipping:</span>
                                    <span className="font-bold text-gray-700">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-400">Coupon:</span>
                                    <span className="font-bold text-gray-700">—</span>
                                </div>
                                <div className="h-px bg-gray-200 w-full my-2" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-black text-gray-900">Total:</span>
                                    <span className="text-2xl font-black text-gray-900">₹{orderTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !payLoading && setShowPayModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[28px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <Wallet size={20} />
                                </div>
                                <h2 className="text-lg font-black text-gray-900">Payment For Storehouse</h2>
                            </div>
                            <button
                                onClick={() => setShowPayModal(false)}
                                disabled={payLoading}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8">
                            {paySuccess ? (
                                <div className="py-12 text-center scale-in-center">
                                    <div className="w-20 h-20 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={40} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h3>
                                    <p className="text-gray-500 font-medium">Your order is being processed.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                            <span className="text-gray-500 font-bold">Wallet Balance:</span>
                                            <span className="font-black text-gray-900 text-lg">₹{(walletStats?.mainWallet || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-primary-50 rounded-2xl">
                                            <span className="text-primary-600 font-bold">Pay with wallet:</span>
                                            <span className="font-black text-primary-600 text-lg">₹{storehouseTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {((walletStats?.mainWallet || 0) < storehouseTotal) && (
                                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                                            <AlertCircle size={20} />
                                            <p className="font-black text-sm">Insufficient Wallet Balance</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Transaction Password</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                value={transPassword}
                                                onChange={(e) => setTransPassword(e.target.value)}
                                                placeholder="Enter password..."
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-gray-900 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {payError && (
                                        <p className="text-red-500 text-sm font-bold text-center">⚠ {payError}</p>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setShowPayModal(false)}
                                            disabled={payLoading}
                                            className="grow py-4 bg-pink-500 text-white rounded-2xl font-black text-lg hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePayStorehouse}
                                            disabled={payLoading || (walletStats?.mainWallet || 0) < storehouseTotal}
                                            className="grow-[2] py-4 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center"
                                        >
                                            {payLoading ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .glass-card {
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 24px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                }
                .badge {
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .badge-success { background: #ecfdf5; color: #059669; }
                .badge-warning { background: #fffbeb; color: #d97706; }
                .badge-danger { background: #fef2f2; color: #dc2626; }
                
                @keyframes scale-in-center {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .scale-in-center {
                    animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
            `}</style>
        </Shell>
    );
}


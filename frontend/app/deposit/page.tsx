'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Wallet, ShieldCheck, CreditCard, ArrowRight, Zap, Info, CheckCircle2, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [depositType, setDepositType] = useState<'main' | 'guarantee'>('main');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [currentRecharge, setCurrentRecharge] = useState<any>(null);
    const [paymentStep, setPaymentStep] = useState<'options' | 'card' | 'processing' | 'success'>('options');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('/recharges', {
                amount,
                mode: 'online'
            });
            if (response.success) {
                setCurrentRecharge(response.recharge);
                setShowPayment(true);
                setPaymentStep('options');
            }
        } catch (error: any) {
            setMessage({ text: error.message || 'Error initializing deposit', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompletePayment = async () => {
        setPaymentStep('processing');
        try {
            // Simulate 2s delay
            await new Promise(r => setTimeout(r, 2000));
            const response = await api.put(`/recharges/${currentRecharge._id}/complete`, {});
            if (response.success) {
                setPaymentStep('success');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        } catch (error: any) {
            alert('Payment failed: ' + error.message);
            setPaymentStep('options');
        }
    };

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-8 relative">
                {/* Payment Modal Overlay */}
                {showPayment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
                        <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                            {paymentStep === 'options' && (
                                <div className="p-8 space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <CreditCard className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">Payment Methods</h3>
                                        <p className="text-sm text-gray-500 font-bold">Pay ${amount} to recharge your {depositType} wallet</p>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { name: 'Crypto', info: 'Bitcoin, USDT, ETH', icon: Zap },
                                            { name: 'Card', info: 'Credit or Debit Card', icon: CreditCard },
                                            { name: 'UPI', info: 'GPay, PhonePe, Paytm', icon: Smartphone }
                                        ].map((method) => (
                                            <button
                                                key={method.name}
                                                onClick={() => setPaymentStep('card')}
                                                className="w-full p-4 flex items-center gap-4 bg-gray-50 hover:bg-primary-50 hover:ring-2 hover:ring-primary-500/20 rounded-2xl transition-all group border border-gray-100 text-left"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    <method.icon className="w-6 h-6 text-primary-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="block font-black text-gray-900 group-hover:text-primary-700">{method.name}</span>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{method.info}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-primary-500 transition-all" />
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setShowPayment(false)}
                                        className="w-full py-4 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                                    >
                                        Cancel Transaction
                                    </button>
                                </div>
                            )}

                            {paymentStep === 'card' && (
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setPaymentStep('options')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                            <ArrowRight className="w-4 h-4 rotate-180" />
                                        </button>
                                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900">Card Details</h3>
                                        <div className="w-8" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Card Number</label>
                                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono font-bold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Expiry Date</label>
                                                <input type="text" placeholder="MM / YY" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase ml-4">CVV No.</label>
                                                <input type="password" placeholder="***" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCompletePayment}
                                        className="w-full py-5 bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <Zap className="w-5 h-5 fill-white" />
                                        Confirm & Pay ${amount}
                                    </button>
                                </div>
                            )}

                            {paymentStep === 'processing' && (
                                <div className="p-12 text-center space-y-6">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
                                        <ShieldCheck className="absolute inset-0 m-auto w-10 h-10 text-primary-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Securing Your Transaction...</h3>
                                        <p className="text-sm text-gray-500 font-bold">Please do not refresh or close this window.</p>
                                    </div>
                                </div>
                            )}

                            {paymentStep === 'success' && (
                                <div className="p-12 text-center space-y-6 bg-gradient-to-b from-success-50/50 to-white">
                                    <div className="w-24 h-24 bg-success-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-success-200 animate-in zoom-in-75 duration-500">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-gray-900 leading-tight">Payment Completed!</h3>
                                        <p className="text-sm text-success-600 font-bold">Funds are successfully added to your wallet.</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Deposit Funds</h2>
                    <p className="text-gray-600">Add funds to your Main Wallet or Security Guarantee Wallet</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setDepositType('main')}
                        className={`premium-card p-6 cursor-pointer transition-all ${depositType === 'main' ? 'ring-2 ring-primary-500 bg-primary-50/30 shadow-lg border-primary-100' : 'hover:bg-gray-50 opacity-60'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-4 rounded-2xl ${depositType === 'main' ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-gray-100 text-gray-500'}`}>
                                <Wallet className="w-8 h-8" />
                            </div>
                            {depositType === 'main' && <CheckCircle2 className="w-6 h-6 text-primary-500" />}
                        </div>
                        <h3 className="text-xl font-bold mt-6 text-gray-900">Main Wallet</h3>
                        <p className="text-sm text-gray-500 mt-2">Used for advertising, purchasing packages, and general store operations.</p>
                    </div>

                    <div
                        onClick={() => setDepositType('guarantee')}
                        className={`premium-card p-6 cursor-pointer transition-all ${depositType === 'guarantee' ? 'ring-2 ring-success-500 bg-success-50/30 shadow-lg border-success-100' : 'hover:bg-gray-50 opacity-60'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-4 rounded-2xl ${depositType === 'guarantee' ? 'bg-success-500 text-white shadow-lg shadow-success-200' : 'bg-gray-100 text-gray-500'}`}>
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            {depositType === 'guarantee' && <CheckCircle2 className="w-6 h-6 text-success-500" />}
                        </div>
                        <h3 className="text-xl font-bold mt-6 text-gray-900">Guarantee Wallet</h3>
                        <p className="text-sm text-gray-500 mt-2">Mandatory security deposit for store verification and advanced trust ratings.</p>
                    </div>
                </div>

                <div className="glass-card p-8 bg-white/40 border-white/60 relative overflow-hidden">
                    <div className="relative z-10">
                        <form onSubmit={handleDeposit} className="space-y-6">
                            {message.text && (
                                <div className={`p-4 rounded-2xl flex items-start gap-3 ${message.type === 'error' ? 'bg-danger-50 text-danger-700' : 'bg-blue-50 text-blue-700'}`}>
                                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6">Amount to Deposit ($) *</label>
                                <div className="relative">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-primary-500/40">$</span>
                                    <input
                                        required
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-16 pr-8 py-8 bg-gray-50/50 border border-white/40 rounded-[2.5rem] text-4xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {[100, 500, 1000, 5000].map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className={`py-4 px-2 rounded-2xl text-sm font-black transition-all border ${amount === val.toString() ? 'bg-primary-500 text-white border-primary-600 shadow-xl shadow-primary-200' : 'bg-white border-gray-100 text-gray-700 hover:bg-slate-50'}`}
                                    >
                                        ${val}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className={`btn-primary w-full py-6 text-xl rounded-[2.5rem] shadow-2xl shadow-primary-200 flex items-center justify-center gap-4 group transition-all relative overflow-hidden ${isSubmitting || !amount ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-700 transition-opacity group-hover:opacity-90" />
                                <Zap className={`w-6 h-6 fill-white relative z-10 ${isSubmitting ? 'animate-pulse' : 'group-hover:scale-125 transition-transform'}`} />
                                <span className="relative z-10">{isSubmitting ? 'Initializing...' : `Deposit to ${depositType === 'main' ? 'Main' : 'Guarantee'} Wallet`}</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[2rem] shadow-xl">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <CreditCard className="w-6 h-6 text-primary-300" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight uppercase">Secured Gateway</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">All deposits are processed through secure 256-bit encrypted gateways with PCI-DSS compliance.</p>
                    </div>
                </div>
            </div>
        </Shell>
    );
}


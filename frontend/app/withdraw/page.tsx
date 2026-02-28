'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import {
    Wallet, Clock, CheckCircle, XCircle, CreditCard, Plus,
    ArrowRight, Building2, AlertTriangle, Info, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; icon: any }> = {
    0: { label: 'PENDING', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
    1: { label: 'APPROVED', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
    2: { label: 'REJECTED', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
};

export default function WithdrawPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [transPassword, setTransPassword] = useState('');
    const [walletData, setWalletData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        bank_name: '', account_number: '', account_name: '', ifsc_code: '', upi_id: ''
    });
    const [showBankForm, setShowBankForm] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const fetchWalletDetails = async () => {
        setIsLoading(true);
        try {
            // Fetch real wallet balance from stats (same as header wallet)
            const [walletRes, statsRes] = await Promise.all([
                api.get('/withdrawals/wallet-details/info'),
                api.get('/sellers/stats')
            ]);

            if (walletRes.success) {
                const realBalance = statsRes?.success ? (statsRes.stats?.mainWallet ?? walletRes.data.balance) : walletRes.data.balance;
                setWalletData({
                    ...walletRes.data,
                    balance: realBalance
                });
                if (walletRes.data.bank_details) {
                    const bd = walletRes.data.bank_details;
                    if (bd.bank_name || bd.account_number || bd.upi_id) {
                        setBankDetails(bd);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching wallet details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchWalletDetails();
    }, [user]);

    const hasPendingWithdrawal = walletData?.transactions?.withdrawals?.some((w: any) => w.status === 0);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        if (!amount || parseFloat(amount) <= 0) {
            setIsError(true);
            setMessage('Please enter a valid withdrawal amount');
            return;
        }
        if (parseFloat(amount) < 100) {
            setIsError(true);
            setMessage('Minimum withdrawal amount is ₹100');
            return;
        }
        if (!transPassword) {
            setIsError(true);
            setMessage('Transaction password is required');
            return;
        }
        if (!bankDetails.account_number && !bankDetails.upi_id) {
            setIsError(true);
            setMessage('Please enter your bank account details or UPI ID below');
            setShowBankForm(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/withdrawals', {
                amount: parseFloat(amount),
                trans_password: transPassword,
                method: 'bank',
                bank_details: bankDetails,
            });

            if (response.success) {
                setIsError(false);
                setMessage(response.message || 'Withdrawal request submitted! Admin will review within 24-48 hours.');
                setAmount('');
                setTransPassword('');
                fetchWalletDetails();
            }
        } catch (error: any) {
            setIsError(true);
            setMessage(error.message || 'Failed to submit withdrawal request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelWithdrawal = async (id: string) => {
        try {
            await api.put(`/withdrawals/${id}`, { reason: 'Cancelled by seller' });
            fetchWalletDetails();
        } catch (error: any) {
            alert('Failed to cancel: ' + error.message);
        }
    };

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="space-y-8 max-w-6xl mx-auto">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Money Withdraw</h2>
                    <p className="text-gray-600">Manage your earnings and withdrawal requests</p>
                </div>

                {isLoading && !walletData ? (
                    <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
                        <span>Loading wallet data...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* LEFT COLUMN */}
                        <div className="md:col-span-1 space-y-6">
                            {/* Balance Card */}
                            <div className="premium-card p-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Wallet className="w-32 h-32" />
                                </div>
                                <p className="text-sm font-medium text-white/80 mb-1">Available Balance</p>
                                <h3 className="text-4xl font-bold mb-6">₹{walletData?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        Pending: ₹{walletData?.pendingWithdraw?.toLocaleString() || '0.00'}
                                    </div>
                                    <div className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        Last: ₹{walletData?.lastWithdraw?.toLocaleString() || '0.00'}
                                    </div>
                                </div>
                            </div>

                            {/* Pending Request Banner */}
                            {hasPendingWithdrawal && (
                                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '16px' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                                        <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>Request Pending</span>
                                    </div>
                                    <p style={{ color: '#92400e', fontSize: '12px', lineHeight: '1.5' }}>
                                        You have a pending withdrawal request. Admin is reviewing it. You can only have one pending request at a time.
                                    </p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '16px' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-primary-500" />
                                    <span className="text-primary-700 font-700 text-sm font-semibold">How it works</span>
                                </div>
                                <ul className="space-y-1.5 text-xs text-gray-600">
                                    <li className="flex items-start gap-2"><span className="inline-block w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-[10px] flex items-center justify-center font-bold mt-0.5 flex-shrink-0">1</span> Submit withdrawal request</li>
                                    <li className="flex items-start gap-2"><span className="inline-block w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-[10px] flex items-center justify-center font-bold mt-0.5 flex-shrink-0">2</span> Admin reviews &amp; approves</li>
                                    <li className="flex items-start gap-2"><span className="inline-block w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-[10px] flex items-center justify-center font-bold mt-0.5 flex-shrink-0">3</span> Amount transferred to your bank</li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Request Form */}
                            <form onSubmit={handleWithdraw} className="glass-card p-6">
                                <h4 className="font-bold text-gray-900 mb-6">Request Withdrawal</h4>

                                {message && (
                                    <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-start gap-3 ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                        {isError ? <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                                        <span>{message}</span>
                                    </div>
                                )}

                                {hasPendingWithdrawal ? (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                                        <p className="text-gray-700 font-semibold text-lg">Withdrawal Under Review</p>
                                        <p className="text-gray-500 text-sm mt-1">Your request is being reviewed by the admin. You&#39;ll be notified once it&#39;s processed.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {/* Amount Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount to Withdraw</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Minimum: ₹100 | Available: ₹{walletData?.balance?.toFixed(2) || '0.00'}</p>
                                        </div>

                                        {/* Quick Amount Buttons */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[500, 1000, 2500, 5000].map(val => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setAmount(val.toString())}
                                                    className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
                                                >
                                                    ₹{val.toLocaleString()}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setAmount(Math.floor(walletData?.balance || 0).toString())}
                                                className="col-span-2 py-3 px-4 bg-primary-50 border border-primary-100 rounded-xl text-sm font-bold text-primary-600 hover:bg-primary-100 transition-all"
                                            >
                                                Withdraw Max Balance
                                            </button>
                                        </div>

                                        {/* Transaction Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Password</label>
                                            <input
                                                type="password"
                                                value={transPassword}
                                                onChange={(e) => setTransPassword(e.target.value)}
                                                placeholder="Enter your transaction password"
                                                className="input-field py-4"
                                            />
                                        </div>

                                        {/* Bank Details Toggle */}
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setShowBankForm(!showBankForm)}
                                                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                            >
                                                <Building2 className="w-4 h-4" />
                                                {showBankForm ? 'Hide Bank Details' : 'Add / Edit Bank Details'}
                                                <Plus className={`w-4 h-4 transition-transform ${showBankForm ? 'rotate-45' : ''}`} />
                                            </button>

                                            {showBankForm && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-100">
                                                    <p className="text-xs text-gray-500 font-medium">Bank details will be saved with your withdrawal request for admin reference.</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-gray-600 font-medium block mb-1">Bank Name</label>
                                                            <input
                                                                type="text"
                                                                value={bankDetails.bank_name}
                                                                onChange={e => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                                                                placeholder="e.g. SBI, HDFC"
                                                                className="input-field text-sm py-2.5"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-600 font-medium block mb-1">Account Holder Name</label>
                                                            <input
                                                                type="text"
                                                                value={bankDetails.account_name}
                                                                onChange={e => setBankDetails({ ...bankDetails, account_name: e.target.value })}
                                                                placeholder="Full name on account"
                                                                className="input-field text-sm py-2.5"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-600 font-medium block mb-1">Account Number</label>
                                                            <input
                                                                type="text"
                                                                value={bankDetails.account_number}
                                                                onChange={e => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                                                                placeholder="Bank account number"
                                                                className="input-field text-sm py-2.5"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-600 font-medium block mb-1">IFSC Code</label>
                                                            <input
                                                                type="text"
                                                                value={bankDetails.ifsc_code}
                                                                onChange={e => setBankDetails({ ...bankDetails, ifsc_code: e.target.value.toUpperCase() })}
                                                                placeholder="e.g. SBIN0001234"
                                                                className="input-field text-sm py-2.5"
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label className="text-xs text-gray-600 font-medium block mb-1">UPI ID (Optional)</label>
                                                            <input
                                                                type="text"
                                                                value={bankDetails.upi_id}
                                                                onChange={e => setBankDetails({ ...bankDetails, upi_id: e.target.value })}
                                                                placeholder="e.g. name@paytm"
                                                                className="input-field text-sm py-2.5"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`btn-primary w-full py-4 text-lg shadow-xl shadow-primary-200 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}
                                            {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />}
                                        </button>

                                        <p className="text-xs text-gray-500 text-center">
                                            ⏱ Withdrawal requests are reviewed by admin within 24-48 hours
                                        </p>
                                    </div>
                                )}
                            </form>

                            {/* Recent Withdrawal History */}
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-bold text-gray-900">Withdrawal History</h4>
                                    <button onClick={fetchWalletDetails} className="text-primary-500 hover:text-primary-600 transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {!walletData?.transactions?.withdrawals || walletData.transactions.withdrawals.length === 0 ? (
                                        <p className="text-center py-6 text-gray-500 text-sm">No withdrawal history yet.</p>
                                    ) : (
                                        walletData.transactions.withdrawals.map((tx: any, idx: number) => {
                                            const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG[0];
                                            const Icon = cfg.icon;
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-xl" style={{ background: cfg.bg }}>
                                                            <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Withdrawal Request</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                            {tx.reason && tx.status === 2 && (
                                                                <p className="text-xs text-red-500 mt-0.5">Reason: {tx.reason}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-1.5">
                                                        <p className="text-sm font-bold text-gray-900">₹{tx.amount?.toLocaleString()}</p>
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                                                            {cfg.label}
                                                        </span>
                                                        {tx.status === 0 && (
                                                            <button
                                                                onClick={() => handleCancelWithdrawal(tx._id)}
                                                                className="text-[10px] text-red-500 hover:text-red-700 font-medium mt-0.5"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    );
}

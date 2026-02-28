'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, CreditCard, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [transPassword, setTransPassword] = useState('');
    const [walletData, setWalletData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchWalletDetails = async () => {
        try {
            const response = await api.get('/withdrawals/wallet-details/info');
            if (response.success) {
                setWalletData(response.data);
            }
        } catch (error) {
            console.error('Error fetching wallet details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWalletDetails();
        }
    }, [user]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setMessage('Error: Please enter a valid amount');
            return;
        }
        if (!transPassword) {
            setMessage('Error: Transaction password is required');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await api.post('/withdrawals', {
                amount: parseFloat(amount),
                trans_password: transPassword,
                method: 'bank' // Defaulting to bank
            });

            if (response.success) {
                setMessage('Withdrawal request submitted successfully!');
                setAmount('');
                setTransPassword('');
                fetchWalletDetails(); // Refresh balance and history
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || (!user)) return null;

    return (
        <Shell>
            <div className="space-y-8 max-w-6xl mx-auto">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Money Withdraw</h2>
                    <p className="text-gray-600 focus:outline-none">Manage your earnings and withdrawal requests</p>
                </div>

                {isLoading && !walletData ? (
                    <div className="text-center py-20 text-gray-500">Loading wallet data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            {/* Balance Card */}
                            <div className="premium-card p-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Wallet className="w-32 h-32" />
                                </div>
                                <p className="text-sm font-medium text-white/80 mb-1">Available Balance</p>
                                <h3 className="text-4xl font-bold mb-6">${walletData?.balance?.toLocaleString() || '0.00'}</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Pending: ${walletData?.pendingWithdraw?.toLocaleString() || '0.00'}</div>
                                    <div className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Last: ${walletData?.lastWithdraw?.toLocaleString() || '0.00'}</div>
                                </div>
                            </div>

                            {/* Withdrawal Methods */}
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-900">Withdraw To</h4>
                                    <button className="text-primary-600 hover:text-primary-700 transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Bank Account', details: 'Direct Bank Transfer', active: true },
                                    ].map((method, idx) => (
                                        <div key={idx} className={`p-4 border rounded-2xl cursor-pointer transition-all ${method.active ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500' : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${method.active ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{method.name}</p>
                                                    <p className="text-xs text-gray-500">{method.details}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            {/* Request Form */}
                            <form onSubmit={handleWithdraw} className="glass-card p-6">
                                <h4 className="font-bold text-gray-900 mb-6">Request Withdrawal</h4>

                                {message && (
                                    <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.includes('Error') ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'}`}>
                                        {message}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount to Withdraw</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: $100.00 | Fee: $0.00</p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[500, 1000, 2500, 5000].map(val => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setAmount(val.toString())}
                                                className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
                                            >
                                                ${val}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setAmount(walletData?.balance?.toString() || '0')}
                                            className="col-span-2 py-3 px-4 bg-primary-50 border border-primary-100 rounded-xl text-sm font-bold text-primary-600 hover:bg-primary-100 transition-all font-outfit"
                                        >
                                            Withdraw Max Balance
                                        </button>
                                    </div>

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

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`btn-primary w-full py-4 text-lg shadow-xl shadow-primary-200 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Proceed to Withdrawal'}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </div>
                            </form>

                            {/* Recent History */}
                            <div className="glass-card p-6">
                                <h4 className="font-bold text-gray-900 mb-6">Recent Transactions</h4>
                                <div className="space-y-4">
                                    {!walletData?.transactions?.withdrawals || walletData.transactions.withdrawals.length === 0 ? (
                                        <p className="text-center py-6 text-gray-500">No recent transactions found.</p>
                                    ) : (
                                        walletData.transactions.withdrawals.map((tx: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${tx.status === 1 ? 'bg-success-100 text-success-600' : tx.status === 0 ? 'bg-warning-100 text-warning-600' : 'bg-danger-100 text-danger-600'}`}>
                                                        {tx.status === 1 ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">Withdrawal Request</p>
                                                        <p className="text-xs text-gray-500">{new Date(tx.createdAt || tx.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">${tx.amount.toLocaleString()}</p>
                                                    <p className={`text-[10px] font-bold uppercase ${tx.status === 1 ? 'text-success-600' : tx.status === 0 ? 'text-warning-600' : 'text-danger-600'}`}>
                                                        {tx.status === 0 ? 'PENDING' : tx.status === 1 ? 'APPROVED' : 'REJECTED'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
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

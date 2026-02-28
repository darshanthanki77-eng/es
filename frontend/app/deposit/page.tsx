'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import {
    Wallet, ShieldCheck, ArrowRight, Zap, Info,
    CheckCircle2, Copy, Check, AlertTriangle, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const CRYPTO_NETWORKS = [
    { key: 'usdt_trc20', label: 'USDT (TRC20)', color: '#26A17B', bg: 'rgba(38,161,123,0.1)', border: 'rgba(38,161,123,0.25)', icon: '₮' },
    { key: 'usdt_erc20', label: 'USDT (ERC20)', color: '#627EEA', bg: 'rgba(98,126,234,0.1)', border: 'rgba(98,126,234,0.25)', icon: '₮' },
    { key: 'btc', label: 'Bitcoin (BTC)', color: '#F7931A', bg: 'rgba(247,147,26,0.1)', border: 'rgba(247,147,26,0.25)', icon: '₿' },
    { key: 'eth', label: 'Ethereum (ETH)', color: '#627EEA', bg: 'rgba(98,126,234,0.1)', border: 'rgba(98,126,234,0.25)', icon: 'Ξ' },
];

export default function DepositPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [depositType, setDepositType] = useState<'main' | 'guarantee'>('main');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [currentRecharge, setCurrentRecharge] = useState<any>(null);
    const [paymentStep, setPaymentStep] = useState<'crypto' | 'confirming' | 'success'>('crypto');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [cryptoSettings, setCryptoSettings] = useState<any>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('usdt_trc20');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    // Fetch admin's crypto payment details
    useEffect(() => {
        const fetchCrypto = async () => {
            try {
                // Use plain fetch since this is a public endpoint
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/settings/crypto`);
                const data = await res.json();
                if (data.success) setCryptoSettings(data.crypto);
            } catch (e) {
                console.error('Failed to fetch crypto settings', e);
            }
        };
        fetchCrypto();
    }, []);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setMessage({ text: 'Please enter a valid amount', type: 'error' });
            return;
        }
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await api.post('/recharges', { amount, mode: 'crypto' });
            if (response.success) {
                setCurrentRecharge(response.recharge);
                setShowPayment(true);
                setPaymentStep('crypto');
            }
        } catch (error: any) {
            setMessage({ text: error.message || 'Error initializing deposit', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmPayment = async () => {
        setPaymentStep('confirming');
        try {
            // Mark the recharge as submitted (pending admin approval)
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/recharges/${currentRecharge._id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({})
            });
            setPaymentStep('success');
            setTimeout(() => router.push('/'), 2500);
        } catch (error: any) {
            alert('Error: ' + error.message);
            setPaymentStep('crypto');
        }
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const selectedCryptoAddress = cryptoSettings ? cryptoSettings[selectedNetwork] : '';
    const selectedNetworkInfo = CRYPTO_NETWORKS.find(n => n.key === selectedNetwork);

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-8 relative">

                {/* ===== PAYMENT MODAL ===== */}
                {showPayment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => paymentStep === 'crypto' && setShowPayment(false)} />
                        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">

                            {/* ---- CRYPTO DETAILS STEP ---- */}
                            {paymentStep === 'crypto' && (
                                <div className="p-8 space-y-6">
                                    {/* Header */}
                                    <div className="text-center space-y-1">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-black" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>₮</div>
                                        <h3 className="text-2xl font-black text-gray-900">Crypto Payment</h3>
                                        <p className="text-sm text-gray-500 font-semibold">Send <span className="text-primary-600 font-black">${amount}</span> to the address below</p>
                                    </div>

                                    {/* Network Selector */}
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Network</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {CRYPTO_NETWORKS.filter(n => cryptoSettings && cryptoSettings[n.key]).map(net => (
                                                <button
                                                    key={net.key}
                                                    onClick={() => setSelectedNetwork(net.key)}
                                                    style={{
                                                        background: selectedNetwork === net.key ? net.bg : 'rgba(0,0,0,0.02)',
                                                        border: selectedNetwork === net.key ? `2px solid ${net.border}` : '2px solid transparent',
                                                        borderRadius: '14px', padding: '10px 14px', cursor: 'pointer',
                                                        textAlign: 'left', transition: 'all 0.15s'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '18px', fontWeight: '900', color: net.color, lineHeight: 1 }}>{net.icon}</div>
                                                    <div style={{ fontSize: '12px', fontWeight: '700', color: selectedNetwork === net.key ? net.color : '#374151', marginTop: '4px' }}>{net.label}</div>
                                                </button>
                                            ))}
                                            {/* Show all if no crypto is configured yet */}
                                            {(!cryptoSettings || CRYPTO_NETWORKS.filter(n => cryptoSettings[n.key]).length === 0) && (
                                                CRYPTO_NETWORKS.map(net => (
                                                    <button
                                                        key={net.key}
                                                        onClick={() => setSelectedNetwork(net.key)}
                                                        style={{
                                                            background: selectedNetwork === net.key ? net.bg : 'rgba(0,0,0,0.02)',
                                                            border: selectedNetwork === net.key ? `2px solid ${net.border}` : '2px solid transparent',
                                                            borderRadius: '14px', padding: '10px 14px', cursor: 'pointer',
                                                            textAlign: 'left', transition: 'all 0.15s'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '18px', fontWeight: '900', color: net.color, lineHeight: 1 }}>{net.icon}</div>
                                                        <div style={{ fontSize: '12px', fontWeight: '700', color: selectedNetwork === net.key ? net.color : '#374151', marginTop: '4px' }}>{net.label}</div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Wallet Address Display */}
                                    {selectedCryptoAddress ? (
                                        <div style={{
                                            background: selectedNetworkInfo?.bg || 'rgba(99,102,241,0.08)',
                                            border: `1px solid ${selectedNetworkInfo?.border || 'rgba(99,102,241,0.2)'}`,
                                            borderRadius: '16px', padding: '16px'
                                        }}>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                {selectedNetworkInfo?.label} Wallet Address
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p style={{
                                                    fontFamily: 'monospace', fontSize: '13px', fontWeight: '700',
                                                    color: '#111827', wordBreak: 'break-all', flex: 1, lineHeight: '1.6'
                                                }}>
                                                    {selectedCryptoAddress}
                                                </p>
                                                <button
                                                    onClick={() => handleCopy(selectedCryptoAddress, selectedNetwork)}
                                                    style={{
                                                        background: copied === selectedNetwork ? '#10b981' : '#6366f1',
                                                        border: 'none', borderRadius: '10px', padding: '8px',
                                                        cursor: 'pointer', color: 'white', flexShrink: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {copied === selectedNetwork ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {copied === selectedNetwork && (
                                                <p style={{ color: '#10b981', fontSize: '11px', fontWeight: '600', marginTop: '6px' }}>✅ Address copied!</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-amber-700">Address not configured</p>
                                                <p className="text-xs text-amber-600 mt-0.5">Admin has not set a {selectedNetworkInfo?.label} address yet. Please contact admin.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Warning Note */}
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-700 leading-relaxed">
                                            <strong>Important:</strong> Send exactly <strong>${amount}</strong> to the address above.
                                            After sending, click <strong>&quot;I Have Sent&quot;</strong> below.
                                            Admin will verify and credit your account within <strong>1-24 hours</strong>.
                                            {cryptoSettings?.network_note && <><br /><span className="text-blue-500 mt-1 block">{cryptoSettings.network_note}</span></>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowPayment(false)}
                                            className="flex-1 py-4 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 rounded-2xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmPayment}
                                            className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" /> I Have Sent the Crypto
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ---- CONFIRMING STEP ---- */}
                            {paymentStep === 'confirming' && (
                                <div className="p-12 text-center space-y-6">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
                                        <ShieldCheck className="absolute inset-0 m-auto w-10 h-10 text-primary-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900">Submitting Request...</h3>
                                        <p className="text-sm text-gray-500 font-bold">Please do not refresh this window.</p>
                                    </div>
                                </div>
                            )}

                            {/* ---- SUCCESS STEP ---- */}
                            {paymentStep === 'success' && (
                                <div className="p-12 text-center space-y-6 bg-gradient-to-b from-success-50/50 to-white">
                                    <div className="w-24 h-24 bg-success-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-success-200">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-gray-900">Request Submitted!</h3>
                                        <p className="text-sm text-success-600 font-bold">Admin will verify your crypto transaction and credit your wallet within 1-24 hours.</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== PAGE CONTENT ===== */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Deposit Funds</h2>
                    <p className="text-gray-600">Add funds to your Main Wallet or Security Guarantee Wallet via Crypto</p>
                </div>

                {/* Wallet Type Selector */}
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

                {/* Amount Form */}
                <div className="glass-card p-8 bg-white/40 border-white/60 relative overflow-hidden">
                    {/* Crypto badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Crypto Payment Only</span>
                        </div>
                        <span className="text-xs text-gray-400">USDT · BTC · ETH</span>
                    </div>

                    <form onSubmit={handleDeposit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-2xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700'}`}>
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6">Amount ($) *</label>
                            <div className="relative">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-primary-500/40">$</span>
                                <input
                                    required
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    className="w-full pl-16 pr-8 py-8 bg-gray-50/50 border border-white/40 rounded-[2.5rem] text-4xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            {cryptoSettings?.min_deposit && (
                                <p className="text-xs text-gray-400 mt-2 ml-6">Minimum deposit: ${cryptoSettings.min_deposit}</p>
                            )}
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
                            {isSubmitting
                                ? <RefreshCw className="w-6 h-6 animate-spin relative z-10" />
                                : <Zap className="w-6 h-6 fill-white relative z-10 group-hover:scale-125 transition-transform" />
                            }
                            <span className="relative z-10">{isSubmitting ? 'Preparing...' : `Deposit to ${depositType === 'main' ? 'Main' : 'Guarantee'} Wallet`}</span>
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Info Bar */}
                <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[2rem] shadow-xl">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight uppercase">Crypto Only · Fast &amp; Secure</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Send crypto to the admin wallet address. Admin verifies and credits your account within 1-24 hours.</p>
                    </div>
                </div>
            </div>
        </Shell>
    );
}

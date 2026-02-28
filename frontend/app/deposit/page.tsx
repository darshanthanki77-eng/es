'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import {
    Wallet, ShieldCheck, ArrowRight, Zap, Info,
    CheckCircle2, Copy, Check, AlertTriangle,
    RefreshCw, Building2, Bitcoin
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

type PayMode = 'crypto' | 'bank';

export default function DepositPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [depositType, setDepositType] = useState<'main' | 'guarantee'>('main');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [currentRecharge, setCurrentRecharge] = useState<any>(null);
    const [payMode, setPayMode] = useState<PayMode>('crypto');
    const [payStep, setPayStep] = useState<'details' | 'confirming' | 'success'>('details');
    const [message, setMessage] = useState({ text: '', type: '' });

    // Settings
    const [cryptoSettings, setCryptoSettings] = useState<any>(null);
    const [bankSettings, setBankSettings] = useState<any>(null);
    const [selectedNetwork, setSelectedNetwork] = useState('usdt_trc20');
    const [copied, setCopied] = useState<string | null>(null);

    // Form fields
    const [transPassword, setTransPassword] = useState('');
    const [senderWallet, setSenderWallet] = useState('');
    const [txnHash, setTxnHash] = useState('');
    const [bankRef, setBankRef] = useState('');

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    // Fetch both crypto and bank settings
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        Promise.all([
            fetch(`${API_URL}/settings/crypto`).then(r => r.json()),
            fetch(`${API_URL}/settings/bank`).then(r => r.json()),
        ]).then(([cData, bData]) => {
            if (cData.success) setCryptoSettings(cData.crypto);
            if (bData.success) setBankSettings(bData.bank);
        }).catch(console.error);
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
            const response = await api.post('/recharges', { amount, mode: payMode, payment_method: payMode });
            if (response.success) {
                setCurrentRecharge(response.recharge);
                // Reset proof fields
                setTransPassword(''); setSenderWallet(''); setTxnHash(''); setBankRef('');
                setShowPayment(true);
                setPayStep('details');
            }
        } catch (error: any) {
            setMessage({ text: error.message || 'Error initializing deposit', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!transPassword) {
            alert('Transaction password is required');
            return;
        }
        if (payMode === 'crypto' && !senderWallet) {
            alert('Please enter your wallet address (address you sent from)');
            return;
        }
        if (payMode === 'bank' && !bankRef) {
            alert('Please enter the UTR/Reference number from your bank transfer');
            return;
        }

        setPayStep('confirming');
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const body: any = {
                trans_password: transPassword,
                payment_method: payMode,
                network: selectedNetwork,
            };
            if (payMode === 'crypto') {
                body.sender_wallet = senderWallet;
                body.txn_hash = txnHash;
            } else {
                body.bank_reference = bankRef;
            }
            const res = await fetch(`${API_URL}/recharges/${currentRecharge._id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            setPayStep('success');
            setTimeout(() => router.push('/'), 2500);
        } catch (error: any) {
            alert('Error: ' + error.message);
            setPayStep('details');
        }
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const selectedCryptoAddr = cryptoSettings?.[selectedNetwork] || '';
    const selectedNetworkInfo = CRYPTO_NETWORKS.find(n => n.key === selectedNetwork);
    const hasBankDetails = bankSettings && (bankSettings.bank_name || bankSettings.account_number);

    if (authLoading || !user) return null;

    const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false }: any) => (
        <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
            <input
                type={type}
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
            />
        </div>
    );

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-8 relative">

                {/* ===== PAYMENT MODAL ===== */}
                {showPayment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => payStep === 'details' && setShowPayment(false)} />
                        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

                            {/* ---- PAYMENT DETAILS STEP ---- */}
                            {payStep === 'details' && (
                                <div className="p-8 space-y-5">
                                    {/* Payment Mode Tabs */}
                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                        {[
                                            { key: 'crypto', label: '₿ Crypto', icon: Bitcoin },
                                            { key: 'bank', label: '🏦 Bank Transfer', icon: Building2 },
                                        ].map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setPayMode(tab.key as PayMode)}
                                                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${payMode === tab.key
                                                    ? 'bg-white shadow text-gray-900'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Amount badge */}
                                    <div className="text-center">
                                        <span className="bg-primary-50 text-primary-700 font-black text-lg px-4 py-2 rounded-xl inline-block">${amount}</span>
                                        <p className="text-xs text-gray-400 mt-1">Transfer this exact amount</p>
                                    </div>

                                    {/* ===== CRYPTO MODE ===== */}
                                    {payMode === 'crypto' && (
                                        <>
                                            {/* Network Selector */}
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Network</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {CRYPTO_NETWORKS.map(net => (
                                                        <button key={net.key} onClick={() => setSelectedNetwork(net.key)} style={{
                                                            background: selectedNetwork === net.key ? net.bg : 'rgba(0,0,0,0.02)',
                                                            border: `2px solid ${selectedNetwork === net.key ? net.border : 'transparent'}`,
                                                            borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', textAlign: 'left'
                                                        }}>
                                                            <div style={{ fontSize: '18px', fontWeight: '900', color: net.color }}>{net.icon}</div>
                                                            <div style={{ fontSize: '12px', fontWeight: '700', color: selectedNetwork === net.key ? net.color : '#374151', marginTop: '2px' }}>{net.label}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Admin Crypto Address */}
                                            {selectedCryptoAddr ? (
                                                <div style={{ background: selectedNetworkInfo?.bg, border: `1px solid ${selectedNetworkInfo?.border}`, borderRadius: '14px', padding: '14px' }}>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Send to this address</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono text-sm font-bold text-gray-900 break-all flex-1">{selectedCryptoAddr}</p>
                                                        <button onClick={() => handleCopy(selectedCryptoAddr, selectedNetwork)} style={{
                                                            background: copied === selectedNetwork ? '#10b981' : '#6366f1',
                                                            border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'white', flexShrink: 0
                                                        }}>
                                                            {copied === selectedNetwork ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                    {copied === selectedNetwork && <p className="text-green-600 text-xs mt-1 font-semibold">✅ Copied!</p>}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-700">Address not configured</p>
                                                        <p className="text-xs text-amber-600">Admin has not set a {selectedNetworkInfo?.label} address yet.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Proof fields */}
                                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Your Payment Proof</p>
                                                <InputField label="Your Wallet Address (sent from)" value={senderWallet} onChange={setSenderWallet} placeholder="e.g. 0x1A2b3C..." required />
                                                <InputField label="Transaction Hash / TxID (optional)" value={txnHash} onChange={setTxnHash} placeholder="e.g. 0xabc123..." />
                                            </div>
                                        </>
                                    )}

                                    {/* ===== BANK MODE ===== */}
                                    {payMode === 'bank' && (
                                        <>
                                            {/* Admin Bank Details */}
                                            {hasBankDetails ? (
                                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Building2 className="w-4 h-4 text-blue-600" />
                                                        <p className="text-xs font-black text-blue-700 uppercase tracking-widest">Transfer To This Bank Account</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: 'Bank Name', value: bankSettings.bank_name },
                                                            { label: 'Account Holder', value: bankSettings.account_name },
                                                            { label: 'Account Number', value: bankSettings.account_number },
                                                            { label: 'IFSC Code', value: bankSettings.ifsc_code },
                                                            { label: 'Branch', value: bankSettings.branch },
                                                            { label: 'SWIFT / BIC', value: bankSettings.swift_code },
                                                        ].filter(f => f.value).map(f => (
                                                            <div key={f.label}>
                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{f.label}</p>
                                                                <div className="flex items-center gap-1 mt-0.5">
                                                                    <p className="text-sm font-bold text-gray-900 font-mono">{f.value}</p>
                                                                    <button onClick={() => handleCopy(f.value, f.label)} className="opacity-40 hover:opacity-100 transition-opacity">
                                                                        {copied === f.label ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {bankSettings.note && (
                                                        <div className="mt-2 pt-2 border-t border-blue-100">
                                                            <p className="text-xs text-blue-600 font-semibold"><Info className="w-3 h-3 inline mr-1" />{bankSettings.note}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-700">Bank details not configured</p>
                                                        <p className="text-xs text-amber-600">Admin has not added bank details yet. Please use Crypto payment or contact admin.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Proof fields */}
                                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Your Payment Proof</p>
                                                <InputField label="UTR / Reference Number" value={bankRef} onChange={setBankRef} placeholder="Enter bank UTR or reference no." required />
                                            </div>
                                        </>
                                    )}

                                    {/* Transaction Password — both modes */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <InputField label="Transaction Password" value={transPassword} onChange={setTransPassword} placeholder="••••••••" type="password" required />
                                    </div>

                                    {/* Info note */}
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2">
                                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            After submitting, admin will verify your payment and credit your wallet within <strong>1-24 hours</strong>.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowPayment(false)} className="flex-1 py-4 text-sm font-black text-gray-400 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={handleConfirmPayment} className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" /> I Have Sent — Submit
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ---- CONFIRMING ---- */}
                            {payStep === 'confirming' && (
                                <div className="p-12 text-center space-y-6">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
                                        <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Submitting...</h3>
                                        <p className="text-sm text-gray-500 mt-1">Please do not close this window.</p>
                                    </div>
                                </div>
                            )}

                            {/* ---- SUCCESS ---- */}
                            {payStep === 'success' && (
                                <div className="p-12 text-center space-y-6 bg-gradient-to-b from-success-50/50 to-white">
                                    <div className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-success-200">
                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">Request Submitted!</h3>
                                        <p className="text-sm text-success-600 font-bold mt-2">Admin will verify and credit your wallet within 1-24 hours.</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Redirecting...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== PAGE CONTENT ===== */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Deposit Funds</h2>
                    <p className="text-gray-600 mt-1">Choose Crypto or Bank Transfer. Admin verifies and credits your wallet.</p>
                </div>

                {/* Wallet Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { key: 'main', label: 'Main Wallet', desc: 'Used for packages, operations.', Icon: Wallet, color: 'primary' },
                        { key: 'guarantee', label: 'Guarantee Wallet', desc: 'Mandatory security deposit.', Icon: ShieldCheck, color: 'success' },
                    ].map(({ key, label, desc, Icon, color }) => (
                        <div key={key} onClick={() => setDepositType(key as any)}
                            className={`premium-card p-6 cursor-pointer transition-all ${depositType === key
                                ? `ring-2 ring-${color}-500 bg-${color}-50/30 shadow-lg border-${color}-100`
                                : 'hover:bg-gray-50 opacity-60'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-4 rounded-2xl ${depositType === key ? `bg-${color}-500 text-white shadow-lg` : 'bg-gray-100 text-gray-500'}`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                {depositType === key && <CheckCircle2 className={`w-6 h-6 text-${color}-500`} />}
                            </div>
                            <h3 className="text-xl font-bold mt-6 text-gray-900">{label}</h3>
                            <p className="text-sm text-gray-500 mt-2">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Amount Form */}
                <div className="glass-card p-8 bg-white/40 border-white/60">
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Crypto</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Bank Transfer</span>
                        </div>
                        <span className="text-xs text-gray-400">Select method in next step</span>
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
                                <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1"
                                    className="w-full pl-16 pr-8 py-8 bg-gray-50/50 border border-white/40 rounded-[2.5rem] text-4xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[100, 500, 1000, 5000].map(val => (
                                <button key={val} type="button" onClick={() => setAmount(val.toString())}
                                    className={`py-4 px-2 rounded-2xl text-sm font-black transition-all border ${amount === val.toString() ? 'bg-primary-500 text-white border-primary-600 shadow-xl shadow-primary-200' : 'bg-white border-gray-100 text-gray-700 hover:bg-slate-50'}`}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>

                        <button type="submit" disabled={isSubmitting || !amount}
                            className={`btn-primary w-full py-6 text-xl rounded-[2.5rem] shadow-2xl shadow-primary-200 flex items-center justify-center gap-4 group transition-all relative overflow-hidden ${isSubmitting || !amount ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-700 group-hover:opacity-90 transition-opacity" />
                            {isSubmitting ? <RefreshCw className="w-6 h-6 animate-spin relative z-10" /> : <Zap className="w-6 h-6 fill-white relative z-10" />}
                            <span className="relative z-10">{isSubmitting ? 'Preparing...' : `Proceed to Payment`}</span>
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Info bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-5 bg-slate-900 rounded-[1.5rem]">
                        <div className="p-2.5 bg-white/10 rounded-xl"><Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /></div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-wider">Crypto Payment</p>
                            <p className="text-xs text-slate-400 mt-0.5">USDT · BTC · ETH via TRC20/ERC20</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-5 bg-slate-900 rounded-[1.5rem]">
                        <div className="p-2.5 bg-white/10 rounded-xl"><Building2 className="w-5 h-5 text-blue-400" /></div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-wider">Bank Transfer</p>
                            <p className="text-xs text-slate-400 mt-0.5">NEFT · RTGS · IMPS · Wire</p>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Shell from '@/components/layout/Shell';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    CreditCard, Smartphone, Building2, QrCode, CheckCircle2,
    Lock, ArrowRight, ChevronDown, Shield, Zap, RefreshCw,
    Clock, IndianRupee, AlertCircle, X, Copy, Check
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type PayMethod = 'upi' | 'card' | 'netbanking' | 'qr';
type TxStatus = 'pending' | 'success' | 'failed';

interface Transaction {
    id: string;
    method: string;
    amount: number;
    status: TxStatus;
    date: string;
    ref: string;
}

// ── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY_TRANSACTIONS: Transaction[] = [
    { id: '1', method: 'UPI', amount: 5000, status: 'success', date: '2026-02-25', ref: 'UPI2026022500123' },
    { id: '2', method: 'Card', amount: 12000, status: 'success', date: '2026-02-20', ref: 'CRD2026022000456' },
    { id: '3', method: 'Net Banking', amount: 3000, status: 'failed', date: '2026-02-15', ref: 'NB2026021500789' },
    { id: '4', method: 'QR', amount: 8500, status: 'success', date: '2026-02-10', ref: 'QR2026021001011' },
    { id: '5', method: 'UPI', amount: 1500, status: 'pending', date: '2026-02-05', ref: 'UPI2026020501213' },
];

const UPI_IDS = ['merchant@ybl', 'seller@okaxis', 'store@paytm'];
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'];
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
    const map: Record<string, string> = {
        success: 'bg-emerald-100 text-emerald-700',
        failed: 'bg-red-100 text-red-700',
        pending: 'bg-amber-100 text-amber-700',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${map[color] || 'bg-gray-100 text-gray-600'}`}>
            {color === 'success' && <CheckCircle2 className="w-3 h-3" />}
            {color === 'failed' && <X className="w-3 h-3" />}
            {color === 'pending' && <Clock className="w-3 h-3" />}
            {children}
        </span>
    );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function PaymentPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // form state
    const [method, setMethod] = useState<PayMethod>('upi');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState<'form' | 'confirm' | 'processing' | 'success' | 'failed'>('form');
    const [upiId, setUpiId] = useState('');
    const [selectedUpiId, setSelectedUpiId] = useState(UPI_IDS[0]);
    const [bank, setBank] = useState(BANKS[0]);
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const processingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
            return () => { if (timerRef.current) clearInterval(timerRef.current); };
        }
    }, [timer]);

    // ── handlers ────────────────────────────────────────────────────────────
    const handleAmountQuick = (v: number) => setAmount(v.toString());

    const formatCardNum = (val: string) =>
        val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val: string) =>
        val.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

    const sendOtp = () => {
        setOtpSent(true);
        setTimer(30);
    };

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;
        setStep('confirm');
    };

    const handlePay = () => {
        setStep('processing');
        const successProb = Math.random();
        processingRef.current = setTimeout(() => {
            const isSuccess = successProb > 0.15; // 85% success rate
            const newTx: Transaction = {
                id: Date.now().toString(),
                method: method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : method === 'netbanking' ? 'Net Banking' : 'QR',
                amount: parseFloat(amount),
                status: isSuccess ? 'success' : 'failed',
                date: new Date().toISOString().split('T')[0],
                ref: `${method.toUpperCase()}${Date.now()}`,
            };
            setTransactions(prev => [newTx, ...prev]);
            setStep(isSuccess ? 'success' : 'failed');
        }, 2800);
    };

    const resetForm = () => {
        setStep('form');
        setAmount('');
        setUpiId('');
        setOtp('');
        setOtpSent(false);
        setCard({ number: '', expiry: '', cvv: '', name: '' });
    };

    const copyRef = (ref: string) => {
        navigator.clipboard.writeText(ref).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const methodLabel: Record<PayMethod, string> = {
        upi: 'UPI', card: 'Debit / Credit Card', netbanking: 'Net Banking', qr: 'QR Code'
    };

    if (authLoading || !user) return null;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Shell>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
                                <IndianRupee className="w-6 h-6 text-white" />
                            </span>
                            Make a Payment
                        </h2>
                        <p className="text-gray-500 mt-1 ml-12">Recharge your wallet instantly via multiple payment modes</p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-700">256-bit SSL Secure</span>
                    </div>
                </div>

                {/* ── FORM STEP ─────────────────────────────────────────── */}
                {step === 'form' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left – method + form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Method Tabs */}
                            <div className="glass-card p-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Select Payment Method</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {([
                                        { key: 'upi', icon: Smartphone, label: 'UPI', color: 'from-green-400 to-emerald-500' },
                                        { key: 'card', icon: CreditCard, label: 'Card', color: 'from-blue-400 to-indigo-500' },
                                        { key: 'netbanking', icon: Building2, label: 'Net Banking', color: 'from-purple-400 to-violet-500' },
                                        { key: 'qr', icon: QrCode, label: 'QR Code', color: 'from-orange-400 to-pink-500' },
                                    ] as const).map(m => (
                                        <button
                                            key={m.key}
                                            onClick={() => setMethod(m.key)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${method === m.key
                                                ? 'border-primary-400 bg-primary-50 shadow-lg scale-[1.02]'
                                                : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md'
                                                }`}
                                        >
                                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${m.color}`}>
                                                <m.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className={`text-xs font-bold ${method === m.key ? 'text-primary-700' : 'text-gray-600'}`}>{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Selector */}
                            <div className="glass-card p-6 space-y-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Enter Amount</p>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-3xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {QUICK_AMOUNTS.map(v => (
                                        <button
                                            key={v}
                                            onClick={() => handleAmountQuick(v)}
                                            className={`py-2 rounded-xl text-sm font-bold border transition-all ${amount === v.toString()
                                                ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-200'
                                                }`}
                                        >
                                            ₹{v >= 1000 ? `${v / 1000}k` : v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="glass-card p-6 space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment Details</p>

                                {/* UPI */}
                                {method === 'upi' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Merchant UPI ID</label>
                                            <div className="space-y-2">
                                                {UPI_IDS.map(id => (
                                                    <label key={id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedUpiId === id
                                                        ? 'border-primary-400 bg-primary-50'
                                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="upi"
                                                            value={id}
                                                            checked={selectedUpiId === id}
                                                            onChange={() => setSelectedUpiId(id)}
                                                            className="accent-primary-500"
                                                        />
                                                        <Smartphone className="w-4 h-4 text-green-500" />
                                                        <span className="font-mono text-sm font-semibold text-gray-800">{id}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Your UPI ID / Mobile number</label>
                                            <input
                                                value={upiId}
                                                onChange={e => setUpiId(e.target.value)}
                                                placeholder="yourname@upi"
                                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                {method === 'card' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                                            <input
                                                value={card.number}
                                                onChange={e => setCard(c => ({ ...c, number: formatCardNum(e.target.value) }))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all tracking-widest"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Name on Card</label>
                                            <input
                                                value={card.name}
                                                onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                                                placeholder="JOHN DOE"
                                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all uppercase"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry</label>
                                                <input
                                                    value={card.expiry}
                                                    onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                                                <input
                                                    value={card.cvv}
                                                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                                                    placeholder="•••"
                                                    maxLength={3}
                                                    type="password"
                                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all"
                                                />
                                            </div>
                                        </div>
                                        {/* OTP Section */}
                                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                                            <p className="text-xs font-bold text-blue-700">3D Secure Authentication</p>
                                            <div className="flex gap-3">
                                                <input
                                                    value={otp}
                                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="Enter OTP"
                                                    className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-100 rounded-xl font-mono text-sm font-semibold focus:outline-none focus:border-blue-300 tracking-widest"
                                                />
                                                <button
                                                    onClick={sendOtp}
                                                    disabled={timer > 0}
                                                    className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 disabled:opacity-50 transition-all whitespace-nowrap"
                                                >
                                                    {timer > 0 ? `${timer}s` : otpSent ? 'Resend' : 'Send OTP'}
                                                </button>
                                            </div>
                                            {otpSent && <p className="text-xs text-blue-500 font-medium">OTP sent to your registered mobile ****1234</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Net Banking */}
                                {method === 'netbanking' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Your Bank</label>
                                            <div className="relative">
                                                <select
                                                    value={bank}
                                                    onChange={e => setBank(e.target.value)}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all appearance-none cursor-pointer"
                                                >
                                                    {BANKS.map(b => <option key={b}>{b}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                            <p className="text-xs font-bold text-purple-700 mb-2">How it works</p>
                                            <ol className="text-xs text-purple-600 space-y-1">
                                                <li>1. You'll be redirected to your bank's secure portal</li>
                                                <li>2. Login with your net banking credentials</li>
                                                <li>3. Confirm the payment on your bank's page</li>
                                                <li>4. Wallet will be credited instantly on success</li>
                                            </ol>
                                        </div>
                                    </div>
                                )}

                                {/* QR */}
                                {method === 'qr' && (
                                    <div className="space-y-4 text-center">
                                        <p className="text-sm text-gray-500">Scan this QR code with any UPI app to pay</p>
                                        {/* Dummy QR visual */}
                                        <div className="mx-auto w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                                            <div className="relative w-40 h-40">
                                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                                    {/* dummy QR blocks */}
                                                    {[0, 1, 2, 3, 4, 5, 6].map(r =>
                                                        [0, 1, 2, 3, 4, 5, 6].map(c => {
                                                            const on = Math.random() > 0.45 ||
                                                                (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
                                                            return on ? (
                                                                <rect key={`${r}-${c}`}
                                                                    x={c * 14 + 1} y={r * 14 + 1}
                                                                    width={12} height={12} fill="#1e1b4b" rx={1} />
                                                            ) : null;
                                                        })
                                                    )}
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-white rounded-lg p-1 shadow">
                                                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 rounded-md" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-mono text-sm font-bold text-gray-700">merchant@essmartseller</span>
                                            <button onClick={() => copyRef('merchant@essmartseller')} className="text-gray-400 hover:text-primary-500 transition-colors">
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400">Amount will be auto-updated after successful scan</p>
                                    </div>
                                )}

                                {/* Proceed Button */}
                                <button
                                    onClick={handleProceed}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                    className="btn-primary w-full py-5 text-lg rounded-3xl flex items-center justify-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Zap className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
                                    Proceed to Pay ₹{amount ? parseFloat(amount).toLocaleString() : '0'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Right – summary + history */}
                        <div className="space-y-6">
                            {/* Summary card */}
                            <div className="premium-card p-5 space-y-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Summary</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Method</span>
                                        <span className="font-bold text-gray-900">{methodLabel[method]}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Amount</span>
                                        <span className="font-bold text-gray-900">₹{amount ? parseFloat(amount).toLocaleString() : '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Processing Fee</span>
                                        <span className="font-bold text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-black text-gray-900 text-base">
                                        <span>Total</span>
                                        <span className="text-primary-600">₹{amount ? parseFloat(amount).toLocaleString() : '0.00'}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <p className="text-xs text-emerald-700 font-semibold">Your payment is secured & encrypted</p>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="premium-card p-5 space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Transactions</p>
                                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                    {transactions.slice(0, 6).map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-sm transition-all">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">₹{tx.amount.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{tx.ref.slice(0, 12)}…</p>
                                                <p className="text-[10px] text-gray-400">{tx.date} · {tx.method}</p>
                                            </div>
                                            <Pill color={tx.status}>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</Pill>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CONFIRMATION STEP ─────────────────────────────────── */}
                {step === 'confirm' && (
                    <div className="max-w-lg mx-auto glass-card p-8 space-y-6 animate-fade-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Confirm Payment</h3>
                            <p className="text-gray-500 mt-1">Please review your payment details</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-5 space-y-3 text-sm">
                            {[
                                ['Method', methodLabel[method]],
                                ['Amount', `₹${parseFloat(amount).toLocaleString()}`],
                                ['Processing Fee', 'FREE'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                    <span className="text-gray-500 font-medium">{k}</span>
                                    <span className="font-black text-gray-900">{v}</span>
                                </div>
                            ))}
                            <div className="border-t pt-3 flex justify-between text-base">
                                <span className="font-black text-gray-900">Total Due</span>
                                <span className="font-black text-primary-600 text-lg">₹{parseFloat(amount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('form')}
                                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-gray-700 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePay}
                                className="flex-2 flex-1 py-4 btn-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <Lock className="w-4 h-4" /> Confirm & Pay
                            </button>
                        </div>
                    </div>
                )}

                {/* ── PROCESSING STEP ───────────────────────────────────── */}
                {step === 'processing' && (
                    <div className="max-w-md mx-auto glass-card p-12 text-center space-y-6 animate-fade-in">
                        <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                            <div className="absolute inset-3 bg-primary-50 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Processing Payment</h3>
                            <p className="text-gray-500 mt-2 text-sm">Please wait. Do not refresh the page…</p>
                        </div>
                        <div className="flex justify-center gap-2">
                            {[0, 1, 2].map(i => (
                                <div key={i}
                                    className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">Ref: ESS{Date.now()}</p>
                    </div>
                )}

                {/* ── SUCCESS STEP ──────────────────────────────────────── */}
                {step === 'success' && (
                    <div className="max-w-md mx-auto animate-scale-in">
                        <div className="glass-card p-10 text-center space-y-6">
                            {/* Animated checkmark */}
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-300">
                                    <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-gray-900">Payment Successful!</h3>
                                <p className="text-gray-500 mt-2">Your wallet has been credited</p>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <span className="font-black text-emerald-600 text-lg">₹{parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-bold text-gray-800">{methodLabel[method]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Reference</span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-mono text-xs font-bold text-gray-800">
                                            {transactions[0]?.ref.slice(0, 14)}
                                        </span>
                                        <button onClick={() => copyRef(transactions[0]?.ref || '')} className="text-gray-400 hover:text-primary-500">
                                            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={resetForm}
                                    className="flex-1 py-4 btn-primary rounded-2xl font-bold"
                                >
                                    Make Another Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── FAILED STEP ───────────────────────────────────────── */}
                {step === 'failed' && (
                    <div className="max-w-md mx-auto animate-scale-in">
                        <div className="glass-card p-10 text-center space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-30" />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-300">
                                    <X className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-gray-900">Payment Failed</h3>
                                <p className="text-gray-500 mt-2">Something went wrong. Please try again.</p>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-3xl p-4 text-left space-y-1">
                                <p className="text-xs font-bold text-red-700 mb-2">Possible reasons:</p>
                                <p className="text-xs text-red-600">• Insufficient funds in your account</p>
                                <p className="text-xs text-red-600">• Bank server timeout or maintenance</p>
                                <p className="text-xs text-red-600">• Incorrect payment details entered</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep('form')} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-gray-700 transition-all">
                                    Back
                                </button>
                                <button onClick={handlePay} className="flex-1 py-4 btn-danger rounded-2xl font-bold flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Retry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Shell>
    );
}

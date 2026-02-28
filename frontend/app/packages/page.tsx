'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Package, CheckCircle2, Star, Zap, ArrowRight, ShieldCheck, Sparkles, X, Lock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [transPassword, setTransPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [activePackage, setActivePackage] = useState<any>(null);
    const [loadingPackages, setLoadingPackages] = useState(true);

    const packages = [
        {
            id: 'STA-001', sku: 'silver', name: 'Starter Merchant', price: '$50', amount: 50,
            description: 'Perfect for new sellers starting their journey.',
            features: ['5 Products Limit', 'Basic Analytics', 'Community Support', 'Standard Shipping Rates'],
            color: 'from-blue-500 to-cyan-500', popular: false
        },
        {
            id: 'PRO-002', sku: 'platinum', name: 'Professional Seller', price: '$150', amount: 150,
            description: 'Scale your business with advanced tools.',
            features: ['Unlimited Products', 'Advanced AI Insights', 'Priority 24/7 Support', 'Discounted Shipping', 'Custom Branding'],
            color: 'from-primary-600 to-purple-700', popular: true
        },
        {
            id: 'ENT-003', sku: 'diamond', name: 'Enterprise Pro', price: '$450', amount: 450,
            description: 'Complete solution for large scale operations.',
            features: ['Multiple Storefronts', 'Dedicated Account Manager', 'API Access', 'Global Logistics Network', 'Whiteglove Onboarding'],
            color: 'from-slate-800 to-slate-900', popular: false
        }
    ];

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    // Load seller's current active package
    useEffect(() => {
        const loadPkg = async () => {
            setLoadingPackages(true);
            try {
                const res = await api.get('/packages');
                if (res.success) {
                    const active = (res.packages || []).find((p: any) => p.status === 1);
                    setActivePackage(active || null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPackages(false);
            }
        };
        if (user) loadPkg();
    }, [user]);

    const isThisPackageActive = (pkg: any) =>
        activePackage && activePackage.type === pkg.name;

    const handleOpenModal = (pkg: any) => {
        if (activePackage) {
            // Block if already active
            setMessage(`You already have an active ${activePackage.type} package. You can only hold one package at a time.`);
            setIsError(true);
            return;
        }
        setMessage('');
        setIsError(false);
        setTransPassword('');
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handlePurchase = async () => {
        if (!transPassword) {
            setMessage('Please enter your transaction password.');
            setIsError(true);
            return;
        }
        setIsSubmitting(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await api.post('/packages/purchase', {
                packageId: selectedPackage.sku,
                trans_password: transPassword
            });

            if (response.success) {
                setMessage(response.message || '🎉 Package activated successfully!');
                setIsError(false);
                setActivePackage(response.package);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setMessage('');
                    setTransPassword('');
                }, 2500);
            }
        } catch (error: any) {
            setMessage(error.message || 'Something went wrong.');
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto py-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Expansion Packages
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-none">
                        Choose Your <span className="gradient-text">Growth Path</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                        One package, instant activation — no waiting for approval. Your plan activates immediately upon purchase.
                    </p>
                </div>

                {/* Active package banner */}
                {!loadingPackages && activePackage && (
                    <div className="flex items-center gap-4 p-5 bg-success-50 border-2 border-success-200 rounded-2xl">
                        <div className="p-3 bg-success-500 rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-success-800 text-base">Active Package: {activePackage.type}</p>
                            <p className="text-success-600 text-sm font-medium mt-0.5">Your package is active. You can only hold one package at a time.</p>
                        </div>
                    </div>
                )}

                {/* Error banner (shown outside modal when clicking while active) */}
                {message && !isModalOpen && (
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-success-50 border-success-200 text-success-700'}`}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold">{message}</p>
                        <button onClick={() => setMessage('')} className="ml-auto opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
                    {packages.map((pkg) => {
                        const isActive = isThisPackageActive(pkg);
                        const hasOtherActive = activePackage && !isActive;

                        return (
                            <div key={pkg.id} className={`relative flex flex-col group ${pkg.popular ? 'md:-translate-y-4' : ''}`}>
                                {pkg.popular && !isActive && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-yellow-400 text-yellow-950 text-[11px] font-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}
                                {isActive && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-success-500 text-white text-[11px] font-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            YOUR ACTIVE PLAN
                                        </div>
                                    </div>
                                )}

                                <div className={`flex-1 glass-card p-10 flex flex-col border-2 transition-all duration-500 ${isActive
                                    ? 'border-success-500 shadow-[0_30px_60px_rgba(16,185,129,0.15)] ring-8 ring-success-500/5'
                                    : pkg.popular && !hasOtherActive
                                        ? 'border-primary-500 shadow-[0_30px_60px_rgba(79,70,229,0.15)] ring-8 ring-primary-500/5'
                                        : 'border-transparent hover:border-gray-200 hover:shadow-xl'
                                    } ${hasOtherActive ? 'opacity-50' : ''}`}>

                                    {/* Icon & Name */}
                                    <div className="mb-8">
                                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6 shadow-xl ${!hasOtherActive ? 'group-hover:scale-110' : ''} transition-transform duration-500`}>
                                            <Package className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">ID: {pkg.id}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8 pb-8 border-b border-gray-100">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{pkg.price}</span>
                                            <span className="text-gray-400 font-black uppercase text-xs tracking-widest">/ one-time</span>
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">{pkg.description}</p>
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 space-y-4 mb-10">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">What&apos;s Included</p>
                                        {pkg.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="p-1 bg-success-50 rounded-lg mt-0.5 shrink-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    {isActive ? (
                                        <div className="w-full py-5 rounded-[1.5rem] font-black bg-success-500 text-white flex items-center justify-center gap-2 text-base">
                                            <CheckCircle2 className="w-5 h-5" /> Active Plan
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenModal(pkg)}
                                            disabled={!!hasOtherActive}
                                            className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 group/btn ${hasOtherActive
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : pkg.popular
                                                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:bg-primary-500 hover:scale-[1.02]'
                                                    : 'bg-gray-900 text-white hover:bg-gray-700 hover:scale-[1.02]'
                                                }`}
                                        >
                                            {hasOtherActive ? 'Plan Unavailable' : 'Activate Now'}
                                            {!hasOtherActive && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Instant activation note */}
                <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[2rem] shadow-xl">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight uppercase">Instant Activation · No Waiting</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                            Packages activate immediately upon purchase. Amount is deducted from your main wallet balance.
                            Only one package can be active at a time.
                        </p>
                    </div>
                </div>

                {/* Purchase Modal */}
                {isModalOpen && selectedPackage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                        <div className="relative glass-card p-8 w-full max-w-md animate-scale-in">
                            <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedPackage.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Activate Plan</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1">Confirming <strong>{selectedPackage.name}</strong></p>
                            </div>

                            {message && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-bold flex items-start gap-2 ${isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-success-50 text-success-600 border border-success-200'}`}>
                                    {isError ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                                    {message}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plan Amount</span>
                                        <span className="text-xl font-black text-gray-900">{selectedPackage.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activation</span>
                                        <span className="text-xs font-black text-success-600 flex items-center gap-1">
                                            <Zap className="w-3 h-3 fill-success-500" /> Instant
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-400" /> Transaction Password
                                    </label>
                                    <input
                                        type="password"
                                        value={transPassword}
                                        onChange={(e) => setTransPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handlePurchase()}
                                        placeholder="••••••••"
                                        className="input-field py-4"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting || !!message && !isError}
                                    className={`btn-primary w-full py-5 text-lg shadow-xl shadow-primary-200 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <ShieldCheck className="w-5 h-5 animate-pulse" /> Activating...
                                        </span>
                                    ) : '⚡ Confirm & Activate Now'}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                    Activates instantly · No admin approval needed
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Package, CheckCircle2, Star, Zap, ArrowRight, ShieldCheck, Sparkles, X, Lock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const PACKAGES = [
    {
        id: 'STA-001', sku: 'silver', name: 'Starter Merchant', price: '$50', amount: 50,
        description: 'Perfect for new sellers starting their journey.',
        features: ['5 Products Limit', 'Basic Analytics', 'Community Support', 'Standard Shipping Rates'],
        color: 'from-blue-500 to-cyan-500', popular: false,
        activeBg: 'bg-blue-500'
    },
    {
        id: 'PRO-002', sku: 'platinum', name: 'Professional Seller', price: '$150', amount: 150,
        description: 'Scale your business with advanced tools.',
        features: ['Unlimited Products', 'Advanced AI Insights', 'Priority 24/7 Support', 'Discounted Shipping', 'Custom Branding'],
        color: 'from-primary-600 to-purple-700', popular: true,
        activeBg: 'bg-primary-600'
    },
    {
        id: 'ENT-003', sku: 'diamond', name: 'Enterprise Pro', price: '$450', amount: 450,
        description: 'Complete solution for large scale operations.',
        features: ['Multiple Storefronts', 'Dedicated Account Manager', 'API Access', 'Global Logistics Network', 'Whiteglove Onboarding'],
        color: 'from-slate-800 to-slate-900', popular: false,
        activeBg: 'bg-slate-800'
    }
];

export default function PackagesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [transPassword, setTransPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    // Set of purchased package names (type field from DB)
    const [purchasedTypes, setPurchasedTypes] = useState<Set<string>>(new Set());
    const [loadingPackages, setLoadingPackages] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    // Load seller's purchased packages
    useEffect(() => {
        const loadPkg = async () => {
            setLoadingPackages(true);
            try {
                const res = await api.get('/packages');
                if (res.success && res.packages?.length > 0) {
                    // Build a set of already-purchased package type names
                    const types = new Set<string>(res.packages.map((p: any) => p.type));
                    setPurchasedTypes(types);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPackages(false);
            }
        };
        if (user) loadPkg();
    }, [user]);

    const isAlreadyPurchased = (pkg: typeof PACKAGES[0]) =>
        purchasedTypes.has(pkg.name);

    const handleOpenModal = (pkg: typeof PACKAGES[0]) => {
        if (isAlreadyPurchased(pkg)) return; // shouldn't happen (button is hidden)
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
                setMessage(response.message || '🎉 Package activated!');
                setIsError(false);
                // Mark this package type as purchased
                setPurchasedTypes(prev => new Set([...prev, selectedPackage.name]));
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

    // Count how many packages purchased
    const purchasedCount = purchasedTypes.size;

    if (authLoading || !user) return null;

    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto py-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                        <Sparkles className="w-4 h-4" />
                        Expansion Packages
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-none">
                        Choose Your <span className="gradient-text">Growth Path</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                        Each package is a <strong>one-time purchase</strong> that activates instantly. Buy all 3 to unlock every feature.
                    </p>

                    {/* Progress indicator */}
                    {!loadingPackages && purchasedCount > 0 && (
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-success-50 border border-success-200 rounded-2xl mt-2">
                            <CheckCircle2 className="w-5 h-5 text-success-600" />
                            <span className="text-success-700 font-black text-sm">
                                {purchasedCount} of 3 package{purchasedCount > 1 ? 's' : ''} purchased
                            </span>
                            <div className="flex gap-1.5">
                                {PACKAGES.map(p => (
                                    <div key={p.sku} className={`w-3 h-3 rounded-full ${purchasedTypes.has(p.name) ? 'bg-success-500' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
                    {PACKAGES.map((pkg) => {
                        const purchased = isAlreadyPurchased(pkg);

                        return (
                            <div key={pkg.id} className={`relative flex flex-col group ${pkg.popular ? 'md:-translate-y-4' : ''}`}>
                                {/* Badges */}
                                {pkg.popular && !purchased && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-yellow-400 text-yellow-950 text-[11px] font-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}
                                {purchased && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-success-500 text-white text-[11px] font-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            PURCHASED
                                        </div>
                                    </div>
                                )}

                                <div className={`flex-1 glass-card p-10 flex flex-col border-2 transition-all duration-500 ${purchased
                                        ? 'border-success-400 shadow-[0_20px_40px_rgba(16,185,129,0.12)] ring-4 ring-success-500/10 bg-success-50/30'
                                        : pkg.popular
                                            ? 'border-primary-500 shadow-[0_30px_60px_rgba(79,70,229,0.15)] ring-8 ring-primary-500/5'
                                            : 'border-transparent hover:border-gray-200 hover:shadow-xl'
                                    }`}>

                                    {/* Icon */}
                                    <div className="mb-8">
                                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 relative`}>
                                            <Package className="w-8 h-8 text-white" />
                                            {purchased && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center shadow-md">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">ID: {pkg.id}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8 pb-8 border-b border-gray-100">
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-5xl font-black tracking-tighter ${purchased ? 'text-success-600' : 'text-gray-900'}`}>{pkg.price}</span>
                                            <span className="text-gray-400 font-black uppercase text-xs tracking-widest">/ one-time</span>
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">{pkg.description}</p>
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 space-y-4 mb-10">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">What&apos;s Included</p>
                                        {pkg.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`p-1 rounded-lg mt-0.5 shrink-0 ${purchased ? 'bg-success-100' : 'bg-success-50'}`}>
                                                    <CheckCircle2 className={`w-3.5 h-3.5 ${purchased ? 'text-success-600' : 'text-success-500'}`} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    {purchased ? (
                                        <div className="w-full py-5 rounded-[1.5rem] font-black bg-success-500 text-white flex items-center justify-center gap-2 text-base shadow-lg shadow-success-200">
                                            <CheckCircle2 className="w-5 h-5" /> Active · Purchased
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenModal(pkg)}
                                            className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 group/btn ${pkg.popular
                                                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:bg-primary-500 hover:scale-[1.02]'
                                                    : 'bg-gray-900 text-white hover:bg-gray-700 hover:scale-[1.02]'
                                                }`}
                                        >
                                            Activate Now
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Note */}
                <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[2rem] shadow-xl">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight uppercase">One-Time Purchase · Instant Activation</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                            Each package is purchased only once and activates immediately. You can purchase all 3 packages independently.
                        </p>
                    </div>
                </div>

                {/* Purchase Confirmation Modal */}
                {isModalOpen && selectedPackage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                        <div className="relative glass-card p-8 w-full max-w-md animate-scale-in">
                            <button
                                onClick={() => !isSubmitting && setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedPackage.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Activate Package</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1">
                                    Confirming <strong>{selectedPackage.name}</strong> — one-time purchase
                                </p>
                            </div>

                            {message && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-bold flex items-start gap-2 ${isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-success-50 text-success-600 border border-success-200'}`}>
                                    {isError
                                        ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    }
                                    {message}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">One-Time Cost</span>
                                        <span className="text-xl font-black text-gray-900">{selectedPackage.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activation</span>
                                        <span className="text-xs font-black text-success-600 flex items-center gap-1">
                                            <Zap className="w-3 h-3 fill-success-500" /> Instant
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Purchase Limit</span>
                                        <span className="text-xs font-black text-amber-600">Only Once</span>
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
                                        onKeyDown={(e) => e.key === 'Enter' && !isSubmitting && handlePurchase()}
                                        placeholder="••••••••"
                                        className="input-field py-4"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting}
                                    className={`btn-primary w-full py-5 text-lg shadow-xl shadow-primary-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting
                                        ? <span className="flex items-center justify-center gap-2"><ShieldCheck className="w-5 h-5 animate-pulse" /> Activating...</span>
                                        : '⚡ Confirm & Activate Now'
                                    }
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                    This package can only be purchased once
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    );
}

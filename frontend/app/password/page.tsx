'use client';

import { useState } from 'react';
import Shell from '@/components/layout/Shell';
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertTriangle, Key } from 'lucide-react';

export default function PasswordPage() {
    const [showPass, setShowPass] = useState(false);
    const [pin, setPin] = useState(['', '', '', '', '', '']);

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto focus next input
        if (value !== '' && index < 5) {
            const next = document.getElementById(`pin-${index + 1}`);
            next?.focus();
        }
    };

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900">Transaction Password</h2>
                    <p className="text-gray-600 focus:outline-none">Secure your withdrawals and sensitive transactions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="glass-card p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                                    <Key className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-900">Set Transaction PIN</h4>
                            </div>

                            <p className="text-sm text-gray-500 mb-6 focus:outline-none">Enter a 6-digit PIN that will be required for all money withdrawals.</p>

                            <div className="flex justify-between gap-2 md:gap-4 mb-8">
                                {pin.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`pin-${idx}`}
                                        type={showPass ? 'text' : 'password'}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handlePinChange(idx, e.target.value)}
                                        className="w-full h-14 md:h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={() => setShowPass(!showPass)}
                                    className="text-sm font-semibold text-gray-500 hover:text-primary-600 flex items-center gap-2 transition-colors"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showPass ? 'Hide characters' : 'Show characters'}
                                </button>
                                <button className="text-sm font-semibold text-primary-600 hover:underline">Forgot PIN?</button>
                            </div>

                            <button className="btn-primary w-full py-4 text-lg">Update PIN</button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 border-l-4 border-primary-500">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary-600" />
                                Security Tips
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    'Never share your transaction PIN with anyone, including staff.',
                                    'Avoid using simple combinations like 123456 or 000000.',
                                    'Regularly update your PIN every few months for better security.',
                                    'Each withdrawal request will require this PIN for verification.'
                                ].map((tip, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-card p-6 bg-warning-50/50 border-warning-200">
                            <div className="flex gap-4">
                                <AlertTriangle className="w-6 h-6 text-warning-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-warning-900 mb-1">Account Lockdown</h4>
                                    <p className="text-xs text-warning-800 focus:outline-none">Entering incorrect PIN 3 times will temporarily lock your withdrawal capability for 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}

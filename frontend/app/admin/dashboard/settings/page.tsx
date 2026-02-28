'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Save, RefreshCw } from 'lucide-react';

const NETWORKS = [
    { key: 'usdt_trc20', label: 'USDT TRC20 Address', placeholder: 'TRC20 wallet address (starts with T...)' },
    { key: 'usdt_erc20', label: 'USDT ERC20 Address', placeholder: 'ERC20 wallet address (starts with 0x...)' },
    { key: 'btc', label: 'Bitcoin (BTC) Address', placeholder: 'BTC wallet address' },
    { key: 'eth', label: 'Ethereum (ETH) Address', placeholder: 'ETH wallet address (starts with 0x...)' },
];

export default function AdminCryptoSettingsPage() {
    const [form, setForm] = useState({
        usdt_trc20: '', usdt_erc20: '', btc: '', eth: '',
        network_note: 'Please verify the network before sending. Wrong network = lost funds.',
        min_deposit: '10'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/settings/crypto`);
            const data = await res.json();
            if (data.success && data.crypto) {
                setForm({
                    usdt_trc20: data.crypto.usdt_trc20 || '',
                    usdt_erc20: data.crypto.usdt_erc20 || '',
                    btc: data.crypto.btc || '',
                    eth: data.crypto.eth || '',
                    network_note: data.crypto.network_note || '',
                    min_deposit: String(data.crypto.min_deposit || '10'),
                });
            }
        } catch (e) {
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API_URL}/settings/crypto`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, min_deposit: Number(form.min_deposit) })
            });
            const data = await res.json();
            if (data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                setError(data.message || 'Failed to save');
            }
        } catch (e: any) {
            setError(e.message || 'Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: '32px', color: 'white', maxWidth: '700px' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>Crypto Payment Settings</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
                    Set your wallet addresses so sellers can send crypto deposits. These are shown to sellers on the deposit page.
                </p>
            </div>

            {saved && (
                <div style={{
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
                    color: '#10b981', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <CheckCircle size={16} /> Settings saved successfully!
                </div>
            )}

            {error && (
                <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
                    color: '#f87171', fontSize: '14px', fontWeight: '600'
                }}>
                    ❌ {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                    <RefreshCw size={20} style={{ margin: '0 auto 8px', display: 'block', animation: 'spin 1s linear infinite' }} />
                    Loading...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Wallet Addresses */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px', padding: '24px'
                    }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Wallet Addresses
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {NETWORKS.map(net => (
                                <div key={net.key}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                                        {net.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={form[net.key as keyof typeof form]}
                                        onChange={e => setForm({ ...form, [net.key]: e.target.value })}
                                        placeholder={net.placeholder}
                                        style={{
                                            width: '100%', padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: '10px', color: 'white', fontSize: '13px', fontFamily: 'monospace',
                                            outline: 'none', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Settings */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px', padding: '24px'
                    }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Display Settings
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                                    Minimum Deposit Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={form.min_deposit}
                                    onChange={e => setForm({ ...form, min_deposit: e.target.value })}
                                    style={{
                                        width: '160px', padding: '12px 16px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                                    Network Warning Note (shown to sellers)
                                </label>
                                <textarea
                                    value={form.network_note}
                                    onChange={e => setForm({ ...form, network_note: e.target.value })}
                                    placeholder="e.g. Make sure to use TRC20 network for USDT. Wrong network = lost funds."
                                    style={{
                                        width: '100%', padding: '12px 16px', minHeight: '80px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '10px', color: 'white', fontSize: '13px',
                                        outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none', borderRadius: '14px', padding: '16px 32px', color: 'white',
                            fontSize: '15px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center',
                            transition: 'all 0.2s', width: '100%'
                        }}
                    >
                        {saving ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Crypto Settings'}
                    </button>
                </div>
            )}
        </div>
    );
}

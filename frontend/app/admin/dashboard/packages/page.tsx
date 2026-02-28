'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, RefreshCw } from 'lucide-react';

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/packages?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setPackages(data.packages);
            setTotal(data.total);
            setPages(data.pages);
        }
        setLoading(false);
    }, [page]);

    useEffect(() => { fetchPackages(); }, [fetchPackages]);

    return (
        <div style={{ padding: '32px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>Packages</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>{total} total packages purchased</p>
                </div>
                <button onClick={fetchPackages} style={{
                    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '10px', color: '#818cf8', padding: '8px 12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600'
                }}>
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['#', 'Type', 'Amount', 'Profit', 'Product Limit', 'Seller', 'Shop', 'Date'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 16px', textAlign: 'left', fontSize: '11px',
                                        fontWeight: '700', color: 'rgba(255,255,255,0.4)',
                                        textTransform: 'uppercase', letterSpacing: '0.05em'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                    <div style={{
                                        display: 'inline-block', width: '30px', height: '30px',
                                        border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1',
                                        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                                    }} />
                                </td></tr>
                            ) : packages.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                    <Package size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
                                    <div>No packages found</div>
                                </td></tr>
                            ) : packages.map((pkg, i) => (
                                <tr key={pkg._id}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{(page - 1) * 20 + i + 1}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: pkg.type?.toLowerCase().includes('diamond') ? 'rgba(96,165,250,0.15)' :
                                                pkg.type?.toLowerCase().includes('platinum') ? 'rgba(168,85,247,0.15)' : 'rgba(107,114,128,0.15)',
                                            color: pkg.type?.toLowerCase().includes('diamond') ? '#60a5fa' :
                                                pkg.type?.toLowerCase().includes('platinum') ? '#a855f7' : '#9ca3af',
                                            border: `1px solid ${pkg.type?.toLowerCase().includes('diamond') ? 'rgba(96,165,250,0.3)' :
                                                pkg.type?.toLowerCase().includes('platinum') ? 'rgba(168,85,247,0.3)' : 'rgba(107,114,128,0.3)'}`
                                        }}>
                                            {pkg.type || '—'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#10b981' }}>
                                        ₹{pkg.amount?.toLocaleString() || '0'}
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#fbbf24', fontWeight: '600' }}>{pkg.profit || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{pkg.product_limit || '—'}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '14px' }}>{pkg.seller?.name || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{pkg.seller?.shop_name || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                                        {pkg.created_at ? new Date(pkg.created_at).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pages > 1 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                                background: p === page ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                                color: p === page ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                            }}>{p}</button>
                        ))}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

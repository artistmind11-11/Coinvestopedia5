import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, AlertTriangle, Search, FileCode, Bug, Activity, Lock, Zap, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { AdUnit } from '../components/AdUnit';
import { AffiliateCTA } from '../components/AffiliateCTA';
import { PageRoute } from '../types';
import { useAppContext } from '../context/AppContext';

// Interfaces
interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

interface AuditResult {
  contractAddress: string;
  name: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  checks: CheckResult[];
  timestamp: string;
}

export const SecurityAudit: React.FC = () => {
    const { isProUser } = useAppContext();
    const [address, setAddress] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);

    const handleAnalyze = async () => {
        if (!address) return;
        setIsAnalyzing(true);
        setResult(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock result generation
        const score = Math.floor(Math.random() * 40) + 60; // Random score 60-100
        const risk: AuditResult['riskLevel'] = score > 85 ? 'low' : score > 70 ? 'medium' : 'high';

        const mockResult: AuditResult = {
            contractAddress: address,
            name: 'Contract Analysis',
            score,
            riskLevel: risk,
            timestamp: new Date().toISOString(),
            checks: [
                { name: 'Reentrancy Guard', status: Math.random() > 0.2 ? 'pass' : 'fail', description: 'Checks for recursive call vulnerabilities.' },
                { name: 'Access Control', status: 'pass', description: 'Owner privileges are properly restricted.' },
                { name: 'Integer Overflow', status: 'pass', description: 'SafeMath or Solidity 0.8+ usage detected.' },
                { name: 'Flash Loan Resilience', status: risk === 'high' ? 'warning' : 'pass', description: 'Resistance to price manipulation attacks.' },
                { name: 'Unchecked Return Values', status: Math.random() > 0.8 ? 'warning' : 'pass', description: 'External call return values are verified.' },
            ]
        };

        setResult(mockResult);
        setIsAnalyzing(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-500';
        if (score >= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'pass': return <CheckCircle className="text-green-500" size={20} />;
            case 'fail': return <AlertCircle className="text-red-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
            default: return <Activity size={20} />;
        }
    };

    return (
        <div className="animate-fade-in space-y-8 pb-16">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                <div className="xl:col-span-3">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Shield size={14} className="animate-pulse" />
                            <span>Enterprise Security Engine</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 font-heading tracking-tight">
                            Audit Any Contract <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary">In Seconds</span>
                        </h1>
                        <p className="text-text-muted text-lg lg:text-xl mb-10 leading-relaxed font-medium">
                            AI-powered security analysis for EVM and Solana smart contracts. Detect reentrancy, honey pots, and logic flaws before you commit capital.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface/50 p-2 rounded-2xl border border-border shadow-2xl">
                            <div className="flex-1 w-full">
                                <Input 
                                    placeholder="Paste contract address (0x...)" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    icon={<FileCode size={18} className="text-primary" />}
                                    className="bg-transparent border-none focus:ring-0 text-lg py-4"
                                />
                            </div>
                            <Button 
                                onClick={handleAnalyze} 
                                isLoading={isAnalyzing}
                                disabled={!address}
                                size="lg"
                                className="w-full sm:w-auto px-10 font-bold tracking-widest shadow-lg"
                                icon={<Search size={18} />}
                            >
                                START SCAN
                            </Button>
                        </div>
                        
                        {!isProUser && (
                           <div className="mt-8 flex justify-center">
                              <AdUnit size="native" context={{ page: PageRoute.AUDIT }} label="Security Partner" />
                           </div>
                        )}
                    </div>

                    {isAnalyzing && (
                         <div className="max-w-3xl mx-auto space-y-6">
                            <Card className="h-80 flex flex-col items-center justify-center border-primary/30 bg-primary/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                                <div className="relative z-10 text-center">
                                    <Activity className="animate-spin text-primary mx-auto mb-6" size={64} />
                                    <h3 className="text-xl font-bold mb-2 text-text">Analyzing Bytecode...</h3>
                                    <p className="text-text-muted font-medium text-sm animate-pulse tracking-widest uppercase">Checking for 142 known vulnerability patterns</p>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 h-1 bg-background">
                                   <div className="h-full bg-primary animate-progress-fast shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                                </div>
                            </Card>
                         </div>
                    )}

                    {!isAnalyzing && !result && (
                        <div className="max-w-4xl mx-auto mt-12 animate-fade-in">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-xs font-bold font-heading uppercase tracking-[0.3em] text-text-muted whitespace-nowrap">
                                    Most Trusted Hardware Safes 2026
                                </h2>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {!isProUser && (
                                    <>
                                        <AdUnit size="native" partner="ledger" label="Top Rated" />
                                        <AdUnit size="native" partner="trezor" label="Original Choice" />
                                        <div className="hidden lg:block">
                                            <AdUnit size="native" partner="okx" label="Web3 Wallet" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {!isAnalyzing && result && (
                        <div className="space-y-8 animate-slide-up">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="flex flex-col items-center justify-center p-8 bg-surface/80 backdrop-blur border-border/50 shadow-xl group hover:border-primary/30 transition-all">
                                    <div className="text-[10px] text-text-muted uppercase tracking-widest font-extrabold mb-4">Security Score</div>
                                    <div className={`text-6xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}</div>
                                    <div className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-tighter">Reliability index</div>
                                </Card>
                                 <Card className="flex flex-col items-center justify-center p-8 bg-surface/80 backdrop-blur border-border/50 shadow-xl group hover:border-primary/30 transition-all">
                                    <div className="text-[10px] text-text-muted uppercase tracking-widest font-extrabold mb-4">Risk Rating</div>
                                    <div className={`text-3xl font-extrabold uppercase tracking-tight ${result.riskLevel === 'low' ? 'text-green-500' : result.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {result.riskLevel} Risk
                                    </div>
                                    <div className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-tighter">Jurisdictional status</div>
                                </Card>
                                 <Card className="flex flex-col items-center justify-center p-8 bg-surface/80 backdrop-blur border-border/50 shadow-xl group hover:border-primary/30 transition-all">
                                    <div className="text-[10px] text-text-muted uppercase tracking-widest font-extrabold mb-4">Vulnerabilities</div>
                                    <div className="text-3xl font-extrabold text-text tracking-tight">
                                        {result.checks.filter(c => c.status !== 'pass').length} Flags
                                    </div>
                                    <div className="text-red-400 text-[10px] mt-2 font-bold uppercase tracking-tighter">{result.checks.filter(c => c.status === 'fail').length} CRITICAL</div>
                                </Card>
                            </div>

                            <div className="flex justify-center">
                               <AdUnit size="leaderboard" context={{ page: PageRoute.AUDIT }} label="Exchange Integration" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Detailed Checks */}
                                <Card className="border-border/50 shadow-2xl">
                                    <h3 className="text-sm font-bold mb-8 flex items-center gap-2 uppercase tracking-[0.25em] text-text-muted">
                                        <Bug size={16} className="text-primary" />
                                        Vulnerability Report
                                    </h3>
                                    <div className="space-y-4">
                                        {result.checks.map((check, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border group hover:border-primary/20 transition-all">
                                                <div className="mt-1">{getStatusIcon(check.status)}</div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-text flex items-center justify-between">
                                                        {check.name}
                                                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-extrabold tracking-widest ${
                                                            check.status === 'pass' ? 'bg-green-500/10 text-green-400' : 
                                                            check.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 
                                                            'bg-red-500/10 text-red-400'
                                                        }`}>
                                                            {check.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{check.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div className="space-y-8">
                                   {!isProUser && (
                                       <AdUnit 
                                          size="native" 
                                          context={{ page: PageRoute.AUDIT }} 
                                          label="Recommended Fix"
                                          className="w-full !max-w-none"
                                       />
                                   )}

                                   <div className="p-8 bg-surface border border-border rounded-2xl shadow-xl space-y-6 relative overflow-hidden group">
                                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted relative z-10">Institutional Best Practices</h3>
                                      <p className="text-sm text-text-muted leading-relaxed font-medium relative z-10">
                                         Detected risks suggest moving significant capital to a distinct, cold-storage signing environment. 
                                      </p>
                                      {!isProUser && (
                                          <AffiliateCTA 
                                             partner="Ledger" 
                                             variant="card" 
                                             text="Deploy enterprise-grade security for your institutional assets."
                                             ctaLabel="Secure with Ledger"
                                             href="https://shop.ledger.com"
                                          />
                                      )}
                                   </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-6 bg-surface/30 backdrop-blur border border-dashed border-border rounded-2xl text-center">
                                 <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="flex items-center gap-2 text-text-muted font-extrabold text-[10px] uppercase tracking-[0.3em]">
                                        <Lock size={12} />
                                        <span>Security Disclaimer</span>
                                    </div>
                                    <p className="text-xs text-text-muted max-w-2xl leading-relaxed italic">
                                        Antigravity Automated Security Audit (AASA) is a first-pass logical analysis tool. It cannot detect zero-day exploits, novel attack vectors, or external dependency failures. 
                                        Always review the smart contract on Etherscan and verify multi-sig privileges.
                                    </p>
                                 </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audit Sidebar */}
                <aside className="hidden xl:flex flex-col gap-10">
                   <AdUnit size="medium" context={{ page: PageRoute.AUDIT }} label="Sponsored Marketplace" />
                   
                   <div className="p-6 bg-surface border border-border rounded-2xl shadow-lg">
                      <h4 className="font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                         <BarChart3 size={16} className="text-primary" />
                         Recent Scans
                      </h4>
                      <div className="space-y-6">
                         {[
                            { name: 'Curve Llama', score: 98, risk: 'low' },
                            { name: 'MemeSwap V2', score: 42, risk: 'high' },
                            { name: 'ZkLend Protocol', score: 87, risk: 'medium' }
                         ].map((scan, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                               <div>
                                  <div className="text-xs font-bold group-hover:text-primary transition-colors">{scan.name}</div>
                                  <div className="text-[10px] text-text-muted uppercase font-bold">{scan.risk} risk</div>
                               </div>
                               <div className={`text-sm font-bold ${scan.score > 80 ? 'text-green-500' : scan.score > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {scan.score}
                               </div>
                            </div>
                         ))}
                      </div>
                      <Button variant="secondary" size="sm" isFullWidth className="mt-8 text-[10px] font-bold">VIEW PUBLIC REPO</Button>
                   </div>

                   <AdUnit size="skyscraper" context={{ page: PageRoute.AUDIT }} label="Trade Secured Assets" />

                   <div className="leather-card p-6 rounded-2xl border-border border-dashed">
                      <h4 className="font-bold text-xs mb-4 flex items-center gap-2">
                         <Zap size={16} className="text-amber-400" />
                         Join Watcher DAO
                      </h4>
                      <p className="text-[10px] text-text-muted mb-6 leading-relaxed">
                         Contribute vulnerability patterns to our engine and earn security rewards in USDT.
                      </p>
                      <Button isFullWidth size="sm" className="text-[10px]">APPLY AS ANALYST</Button>
                   </div>
                </aside>
            </div>
        </div>
    );
};
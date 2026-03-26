import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, AlertTriangle, Search, FileCode, Bug, Activity, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

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
        <div className="animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                    <Shield size={14} />
                    <span>Smart Contract Scanner</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                    Audit Any Contract <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">In Seconds</span>
                </h1>
                <p className="text-text-muted text-lg mb-8">
                    AI-powered security analysis for Ethereum, BSC, and Solana smart contracts. Detect vulnerabilities before you invest.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 w-full">
                        <Input 
                            placeholder="Paste contract address (0x...)" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            icon={<FileCode size={18} />}
                        />
                    </div>
                    <Button 
                        onClick={handleAnalyze} 
                        isLoading={isAnalyzing}
                        disabled={!address}
                        icon={<Search size={18} />}
                    >
                        Analyze
                    </Button>
                </div>
            </div>

            {isAnalyzing && (
                 <div className="max-w-3xl mx-auto space-y-4">
                    <Card className="h-64 flex items-center justify-center border-primary/30 bg-primary/5">
                        <div className="text-center">
                            <Activity className="animate-spin text-primary mx-auto mb-4" size={48} />
                            <p className="text-text-muted font-medium">Scanning bytecode & analyzing logic...</p>
                        </div>
                    </Card>
                 </div>
            )}

            {!isAnalyzing && result && (
                <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="flex flex-col items-center justify-center p-6 bg-surface/80 backdrop-blur">
                            <div className="text-sm text-text-muted uppercase tracking-wider font-bold mb-2">Security Score</div>
                            <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}/100</div>
                        </Card>
                         <Card className="flex flex-col items-center justify-center p-6 bg-surface/80 backdrop-blur">
                            <div className="text-sm text-text-muted uppercase tracking-wider font-bold mb-2">Risk Level</div>
                            <div className={`text-2xl font-bold uppercase ${result.riskLevel === 'low' ? 'text-green-500' : result.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {result.riskLevel}
                            </div>
                        </Card>
                         <Card className="flex flex-col items-center justify-center p-6 bg-surface/80 backdrop-blur">
                            <div className="text-sm text-text-muted uppercase tracking-wider font-bold mb-2">Vulnerabilities</div>
                            <div className="text-2xl font-bold text-text">
                                {result.checks.filter(c => c.status !== 'pass').length} Found
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Checks */}
                    <Card>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Bug size={20} className="text-primary" />
                            Vulnerability Report
                        </h3>
                        <div className="space-y-4">
                            {result.checks.map((check, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-surface border border-border">
                                    <div className="mt-1">{getStatusIcon(check.status)}</div>
                                    <div>
                                        <div className="font-bold text-text flex items-center gap-2">
                                            {check.name}
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide ${
                                                check.status === 'pass' ? 'bg-green-500/10 text-green-400' : 
                                                check.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {check.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted mt-1">{check.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                    <div className="mt-8 p-4 bg-surface/50 border border-border rounded-xl text-center">
                         <div className="flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center gap-2 text-text-muted font-bold text-sm uppercase tracking-wider">
                                <Lock size={14} />
                                <span>Disclaimer</span>
                            </div>
                            <p className="text-sm text-text-muted max-w-2xl">
                                This tool provides automated analysis and is <strong>not</strong> a substitute for professional, manual security audits. 
                                Smart contract interactions involve significant risk; always perform your own due diligence.
                            </p>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};
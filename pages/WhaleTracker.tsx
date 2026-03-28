import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Table, { Column } from '../components/Table';
import { Lock, Search, Sparkles, ExternalLink, X, Tag, Edit2, Save, Filter, Copy } from 'lucide-react';
import { Modal } from '../components/Modal';
import { analyzeAssetMovement, InsightResult } from '../services/geminiService';
import { Input } from '../components/Input';
import { useAppContext } from '../context/AppContext';
import { PulseIcon } from '../components/AnimatedIcons';
import { fetchWhaleAlerts, fetchMempoolTxs } from '../services/api';

// Helper to generate fake ETH addresses
const generateEthAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for(let i=0; i<40; i++) addr += chars[Math.floor(Math.random() * 16)];
  return addr;
};

// Generate a larger dataset for lazy loading simulation with logic-based types
const generateAllTransactions = (count: number) => {
  const assets = ['BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC', 'ADA', 'DOGE', 'AVAX'];
  
  // Mix of known entities and raw addresses to simulate labeling needs
  const knownExchanges = ['KuCoin Hot Wallet', 'Coinbase 2', 'Kraken 4', 'OKX Cold Storage', 'Huobi 3', 'Binance 8', 'Bybit Hot Wallet'];
  const rawAddresses = Array.from({length: 20}, generateEthAddress); // Pool of recurring addresses
  const allEntities = [...knownExchanges, ...rawAddresses];

  return Array.from({ length: count }).map((_, i) => {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amountVal = Math.floor(Math.random() * 10000) + 100;
    const valueNum = amountVal * (Math.random() * 1000 + 10);
    const valueStr = valueNum.toLocaleString('en-US', { style: 'currency', currency: 'USD', notation: 'compact' });
    
    // Pick random from/to, favoring raw addresses for "whales"
    const from = allEntities[Math.floor(Math.random() * allEntities.length)];
    let to = allEntities[Math.floor(Math.random() * allEntities.length)];
    
    // Ensure from and to are different
    while (from === to) {
      to = allEntities[Math.floor(Math.random() * allEntities.length)];
    }

    const isFromExchange = knownExchanges.includes(from);
    const isToExchange = knownExchanges.includes(to);

    let type: 'inflow' | 'outflow' | 'transfer';

    if (!isFromExchange && isToExchange) {
      type = 'inflow'; // Wallet to Exchange (Potential Sell)
    } else if (isFromExchange && !isToExchange) {
      type = 'outflow'; // Exchange to Wallet (Accumulation)
    } else {
      type = 'transfer'; // Exch->Exch or Wallet->Wallet
    }

    return {
      id: `tx-${i}`,
      time: `${Math.floor(Math.random() * 60)}m ago`,
      amount: `${amountVal.toLocaleString()} ${asset}`,
      assetCode: asset,
      value: valueStr,
      valueNumeric: valueNum,
      amountNumeric: amountVal,
      from,
      to,
      type,
    };
  });
};

// Generate once to persist across renders
const ALL_MOCK_TRANSACTIONS = generateAllTransactions(150);

const flowData = [
  { time: '00:00', inflow: 120, outflow: 80 },
  { time: '04:00', inflow: 150, outflow: 90 },
  { time: '08:00', inflow: 180, outflow: 120 },
  { time: '12:00', inflow: 140, outflow: 200 },
  { time: '16:00', inflow: 220, outflow: 150 },
  { time: '20:00', inflow: 250, outflow: 180 },
  { time: '24:00', inflow: 300, outflow: 210 },
];

export const WhaleTracker: React.FC = () => {
   const { addToast } = useAppContext();
   const [tableData, setTableData] = useState<any[]>([]);
   const [fullLiveDataset, setFullLiveDataset] = useState<any[]>(ALL_MOCK_TRANSACTIONS);
   const [isLoading, setIsLoading] = useState(true);
   const [pagination, setPagination] = useState({
     page: 1,
     pageSize: 10
   });
   const [selectedTx, setSelectedTx] = useState<any>(null);
   const [analysis, setAnalysis] = useState<InsightResult | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);

   // Wallet Labeling State
   const [searchQuery, setSearchQuery] = useState('');
   const [walletLabels, setWalletLabels] = useState<Record<string, string>>({
      // Pre-populate one label for demo purposes (find a raw address from mock if possible, otherwise just a placeholder)
      [ALL_MOCK_TRANSACTIONS.find(t => t.from.startsWith('0x'))?.from || '0x123']: 'Alameda Research (Legacy)'
   });
   
   // State for inline editing in modal
   const [editingAddress, setEditingAddress] = useState<string | null>(null);
   const [tempLabel, setTempLabel] = useState('');

   // Filter Data based on Search
   const filteredData = useMemo(() => {
     if (!searchQuery) return fullLiveDataset;
     const lowerQuery = searchQuery.toLowerCase();
     
     return fullLiveDataset.filter(tx => {
       const fromLabel = walletLabels[tx.from] || '';
       const toLabel = walletLabels[tx.to] || '';
       
       return (
         tx.from.toLowerCase().includes(lowerQuery) ||
         tx.to.toLowerCase().includes(lowerQuery) ||
         tx.assetCode.toLowerCase().includes(lowerQuery) ||
         fromLabel.toLowerCase().includes(lowerQuery) ||
         toLabel.toLowerCase().includes(lowerQuery)
       );
     });
   }, [searchQuery, walletLabels, fullLiveDataset]);

   // Handle API data fetching
   useEffect(() => {
     const fetchLive = async () => {
       setIsLoading(true);
       try {
         const [whaleAlerts, mempoolData] = await Promise.all([
           fetchWhaleAlerts(),
           fetchMempoolTxs()
         ]);

         let transformed: any[] = [];
         
         if (whaleAlerts && whaleAlerts.length > 0) {
           transformed = whaleAlerts.map((tx: any) => {
             const fromOwner = tx.from?.owner || tx.from?.address || 'Unknown';
             const toOwner = tx.to?.owner || tx.to?.address || 'Unknown';
             
             let type: 'inflow' | 'outflow' | 'transfer' = 'transfer';
             if (tx.to?.owner_type === 'exchange' && tx.from?.owner_type !== 'exchange') type = 'inflow';
             else if (tx.from?.owner_type === 'exchange' && tx.to?.owner_type !== 'exchange') type = 'outflow';

             return {
               id: tx.id || tx.hash,
               time: new Date(tx.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               amount: `${tx.amount.toLocaleString()} ${tx.symbol.toUpperCase()}`,
               assetCode: tx.symbol.toUpperCase(),
               value: tx.amount_usd ? tx.amount_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }) : 'Unknown',
               valueNumeric: tx.amount_usd || 0,
               amountNumeric: tx.amount,
               from: fromOwner,
               to: toOwner,
               type
             };
           });
         } else {
           // Fallback if API keys missing, per "Ignore missing APIs" requirement
           transformed = ALL_MOCK_TRANSACTIONS;
         }

         setFullLiveDataset(transformed);
       } catch(e) {
         console.error(e);
         setFullLiveDataset(ALL_MOCK_TRANSACTIONS);
       } finally {
         setIsLoading(false);
       }
     };

     fetchLive();
   }, []);

   // Paginate filtered data for display
   useEffect(() => {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      setTableData(filteredData.slice(start, end));
   }, [pagination.page, pagination.pageSize, filteredData]);

   // Trigger AI analysis when a transaction is selected
   useEffect(() => {
     if (selectedTx) {
       const runAnalysis = async () => {
         setIsAnalyzing(true);
         setAnalysis(null);
         const result = await analyzeAssetMovement(
           selectedTx.assetCode, 
           selectedTx.type, 
           selectedTx.value,
           walletLabels[selectedTx.from] || selectedTx.from,
           walletLabels[selectedTx.to] || selectedTx.to
         );
         setAnalysis(result);
         setIsAnalyzing(false);
       };
       runAnalysis();
     } else {
       setAnalysis(null);
       setEditingAddress(null);
     }
   }, [selectedTx]);

   const handlePageChange = (newPage: number, newSize: number) => {
     setPagination({ page: newPage, pageSize: newSize });
   };

   const closeModal = () => setSelectedTx(null);

   const handleSaveLabel = (address: string) => {
     if (tempLabel.trim()) {
        setWalletLabels(prev => ({ ...prev, [address]: tempLabel.trim() }));
     } else {
        // If empty, remove label
        const newLabels = { ...walletLabels };
        delete newLabels[address];
        setWalletLabels(newLabels);
     }
     setEditingAddress(null);
   };

   // Helper to render address with label
   const AddressCell = ({ address }: { address: string }) => {
      const label = walletLabels[address];
      const isRawAddress = address.startsWith('0x');
      
      const copyToClipboard = (e: React.MouseEvent) => {
         e.stopPropagation();
         navigator.clipboard.writeText(address);
         addToast('Address copied to clipboard', 'success');
      };
      
      if (label) {
        return (
          <div className="flex flex-col">
            <span className="font-bold text-primary flex items-center gap-1">
               <Tag size={10} /> {label}
            </span>
            <div className="flex items-center gap-1 group">
               <span className="text-[10px] text-text-muted truncate max-w-[100px]">{isRawAddress ? `${address.substring(0,6)}...${address.substring(38)}` : address}</span>
               {isRawAddress && (
                  <button 
                     onClick={copyToClipboard}
                     className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-primary transition-all"
                     title="Copy full address"
                  >
                     <Copy size={10} />
                  </button>
               )}
            </div>
          </div>
        );
      }
      
      return (
        <div className="flex items-center gap-2 group">
           <span className={isRawAddress ? "font-mono text-xs text-text-muted" : "font-medium"}>
             {isRawAddress ? `${address.substring(0,6)}...${address.substring(38)}` : address}
           </span>
           {isRawAddress && (
              <button 
                 onClick={copyToClipboard}
                 className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-primary transition-all"
                 title="Copy full address"
              >
                 <Copy size={12} />
              </button>
           )}
        </div>
      );
   };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-2">Whale Radar 🐋</h1>
          <p className="text-text-muted text-sm lg:text-base">Monitor large scale institutional movements in real-time.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
               <input 
                  type="text" 
                  placeholder="Search address, label, or asset..." 
                  value={searchQuery}
                  onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setPagination(p => ({ ...p, page: 1 })); // Reset to page 1 on search
                  }}
                  className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
               />
            </div>
            <Button size="sm" variant="secondary" icon={<Filter size={16} />}>Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="leather-card p-4 lg:p-6 rounded-xl">
           <div className="text-text-muted text-xs lg:text-sm mb-1">24h Large Inflows</div>
           <div className="text-xl lg:text-2xl font-bold text-[#EF4444]">$1.2B</div>
           <div className="text-xs text-text-muted mt-1">Potential Sell Pressure</div>
        </div>
        <div className="leather-card p-4 lg:p-6 rounded-xl">
           <div className="text-text-muted text-xs lg:text-sm mb-1">24h Large Outflows</div>
           <div className="text-xl lg:text-2xl font-bold text-primary">$850M</div>
           <div className="text-xs text-text-muted mt-1">Accumulation</div>
        </div>
        <div className="leather-card p-4 lg:p-6 rounded-xl">
           <div className="text-text-muted text-xs lg:text-sm mb-1">Net Flow</div>
           <div className="text-xl lg:text-2xl font-bold text-primary">+$350M</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
        {/* Net Flow Chart */}
        <div className="leather-card p-4 lg:p-6 rounded-xl flex flex-col">
          <h3 className="font-bold text-sm lg:text-base mb-4">24h Flow Velocity</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#333842' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#EF4444" fillOpacity={1} fill="url(#colorInflow)" />
                <Area type="monotone" dataKey="outflow" stroke="#10B981" fillOpacity={1} fill="url(#colorOutflow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Visual */}
        <div className="leather-card p-4 lg:p-6 rounded-xl relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-background to-background"></div>
          <h3 className="font-bold text-sm lg:text-base mb-2 absolute top-4 left-6 z-10">Exchange Dominance</h3>
          
          <div className="relative w-full aspect-[2/1] max-w-sm mt-8 flex items-center justify-center">
             <div className="absolute top-1/2 left-0 w-16 h-16 -translate-y-1/2 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center">
               <span className="text-xs font-bold text-primary">Binance</span>
             </div>
             <div className="absolute top-1/4 right-0 w-12 h-12 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center">
               <span className="text-[10px] font-bold text-primary">Coinbase</span>
             </div>
             <div className="absolute bottom-1/4 right-8 w-14 h-14 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center">
               <span className="text-[10px] font-bold text-emerald-500">Cold Vault</span>
             </div>
             
             {/* Lines */}
             <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ overflow: 'visible' }}>
                <path d="M 64 50 Q 150 20 280 25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary/30 animate-pulse-slow"></path>
                <path d="M 64 50 Q 150 80 250 75" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow"></path>
             </svg>
          </div>
        </div>
      </div>

      <div className="leather-card rounded-xl overflow-hidden mb-6 lg:mb-8">
         <div className="p-3 lg:p-4 border-b border-border bg-background/50 flex justify-between items-center relative z-10">
            <h3 className="font-bold text-sm lg:text-base">Recent Large Transactions</h3>
            <div className="flex gap-2 items-center">
               <span className="hidden sm:inline text-xs text-text-muted mr-2">
                  {filteredData.length !== ALL_MOCK_TRANSACTIONS.length ? `${filteredData.length} results found` : ''}
               </span>
               <PulseIcon />
               <span className="text-xs text-primary font-bold uppercase">Live Feed</span>
            </div>
         </div>
         <div className="overflow-x-auto relative z-10">
            <Table
              data={tableData}
              loading={isLoading}
              columns={[
                { key: 'time', label: 'Time', width: '15%' },
                { key: 'amount', label: 'Asset', width: '15%', render: (v: string) => <span className="font-medium">{v}</span> },
                { key: 'valueNumeric', label: 'Value', width: '15%', align: 'right', render: (_, item) => item.value },
                { key: 'from', label: 'From', width: '20%', render: (v: string) => <AddressCell address={v} /> },
                { key: 'to', label: 'To', width: '20%', render: (v: string) => <AddressCell address={v} /> },
                { key: 'type', label: 'Type', width: '10%', render: (value: string) => (
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                    value === 'inflow' ? 'bg-[#EF4444]/20 text-[#EF4444]' : value === 'outflow' ? 'bg-primary/20 text-primary' : 'bg-text-muted/20 text-text-muted'
                  }`}>{value}</span>
                ) },
                { key: 'actions', label: 'Analysis', width: '5%', isAction: true, render: (_, item) => (
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTx(item); }}>
                        Analyze
                    </Button>
                ) },
              ] as Column<typeof ALL_MOCK_TRANSACTIONS[0]>[]}
              className="recent-large-transactions"
              ariaLabel="Recent large transactions"
              pagination={{ 
                defaultPageSize: 10, 
                pageSizeOptions: [10, 25, 50],
                totalItems: filteredData.length,
                onPageChange: handlePageChange
              }}
              onRowClick={(item) => setSelectedTx(item)}
              striped
              hoverable
            />
         </div>
         {/* Paywall Overlay */}
         <div className="relative border-t border-border z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface z-10"></div>
            <div className="relative z-20 flex flex-col items-center justify-center py-8 lg:py-12 gap-3 lg:gap-4 px-4">
               <div className="p-2 lg:p-3 bg-primary/10 rounded-full text-primary">
                  <Lock size={24} className="lg:size-[32px]" />
               </div>
               <h3 className="text-lg lg:text-xl font-bold text-center">Unlock Full Live Tracking</h3>
               <p className="text-text-muted text-sm lg:text-base max-w-md text-center">Get access to historical data, wallet labelling, and real-time push notifications.</p>
               <Button className="mt-2">Upgrade to Pro</Button>
            </div>
            <div className="opacity-30 blur-sm pointer-events-none p-4 space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-8 lg:h-10 bg-background rounded w-full"></div>)}
            </div>
         </div>
      </div>

      {/* Transaction Analysis Modal */}
      <Modal 
         isOpen={!!selectedTx} 
         onClose={closeModal}
         title="Transaction Analysis"
         size="lg"
      >
         {selectedTx && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From / To Cards with Label Editing */}
                  {['from', 'to'].map((direction) => {
                     const address = direction === 'from' ? selectedTx.from : selectedTx.to;
                     const label = walletLabels[address];
                     const isEditing = editingAddress === address;
                     const isRawAddress = address.startsWith('0x');

                     return (
                        <div key={direction} className="p-4 bg-surface rounded-lg border border-border flex flex-col gap-2">
                           <div className="flex justify-between items-center">
                              <p className="text-xs text-text-muted uppercase font-bold">{direction === 'from' ? 'From' : 'To'}</p>
                              {/* Only allow labeling if it's a raw address or explicitly unlabeled */}
                              {isRawAddress && (
                                 <button 
                                    onClick={() => {
                                       setEditingAddress(address);
                                       setTempLabel(label || '');
                                    }}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                 >
                                    <Edit2 size={10} /> {label ? 'Edit Label' : 'Add Label'}
                                 </button>
                              )}
                           </div>
                           
                           {isEditing ? (
                              <div className="flex gap-2 items-center mt-1 animate-fade-in">
                                 <input 
                                    autoFocus
                                    className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm focus:border-primary focus:outline-none"
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    placeholder="Enter label (e.g. 'Main Vault')"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel(address)}
                                 />
                                 <button onClick={() => handleSaveLabel(address)} className="p-1 bg-primary/10 text-primary rounded hover:bg-primary hover:text-white transition-colors">
                                    <Save size={16} />
                                 </button>
                                 <button onClick={() => setEditingAddress(null)} className="p-1 text-text-muted hover:text-text">
                                    <X size={16} />
                                 </button>
                              </div>
                           ) : (
                              <div className="break-all">
                                 {label && (
                                    <div className="flex items-center gap-2 mb-1">
                                       <Tag size={14} className="text-primary" />
                                       <span className="font-bold text-lg">{label}</span>
                                    </div>
                                 )}
                                 <div className={`flex items-center gap-2 ${label ? 'text-text-muted text-xs' : 'text-text font-mono text-sm'}`}>
                                    {address}
                                    {isRawAddress && <Copy size={12} className="cursor-pointer hover:text-primary" onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(address);
                                        addToast('Address copied to clipboard', 'success');
                                    }} />}
                                 </div>
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>

               <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border border-border">
                  <div>
                     <p className="text-xs text-text-muted uppercase mb-1">Amount</p>
                     <p className="text-xl font-bold font-mono">{selectedTx.amount}</p>
                  </div>
                  <div>
                     <p className="text-xs text-text-muted uppercase mb-1">Value</p>
                     <p className="text-xl font-bold text-primary">{selectedTx.value}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <Sparkles size={18} className="text-primary" />
                     <h3 className="font-bold">AI Insight</h3>
                  </div>
                  
                  {isAnalyzing ? (
                     <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6"></div>
                        <div className="h-4 bg-white/10 rounded w-4/6"></div>
                     </div>
                  ) : analysis ? (
                     <div className="space-y-4">
                        <p className="text-sm text-text-muted leading-relaxed">
                           {analysis.text}
                        </p>
                        {analysis.sources && analysis.sources.length > 0 && (
                           <div className="pt-3 border-t border-border">
                              <p className="text-xs font-bold text-text-muted uppercase mb-2">Sources</p>
                              <ul className="space-y-1">
                                 {analysis.sources.map((source, i) => (
                                    <li key={i}>
                                       <a 
                                          href={source.uri}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-xs text-primary hover:underline"
                                       >
                                          <ExternalLink size={10} />
                                          <span className="truncate">{source.title}</span>
                                       </a>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}
                     </div>
                  ) : (
                     <p className="text-sm text-red-400">Analysis failed. Please check your network or API key.</p>
                  )}
               </div>

               <Button isFullWidth onClick={closeModal} variant="secondary">Close Report</Button>
            </div>
         )}
      </Modal>
    </div>
  );
};
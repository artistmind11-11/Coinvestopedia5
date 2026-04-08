import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export const FixedIncomeCalculator: React.FC = () => {
  const [faceValue, setFaceValue] = useState('1000');
  const [currentPrice, setCurrentPrice] = useState('950');
  const [couponRate, setCouponRate] = useState('5');
  const [yearsToMaturity, setYearsToMaturity] = useState('10');
  const [paymentFreq, setPaymentFreq] = useState('2'); // Semi-annual default

  const result = useMemo(() => {
    const fv = parseFloat(faceValue) || 1000;
    const price = parseFloat(currentPrice) || 950;
    const annualCouponRate = (parseFloat(couponRate) || 0) / 100;
    const ytmYears = parseFloat(yearsToMaturity) || 10;
    const freq = parseFloat(paymentFreq) || 2;

    const totalPeriods = ytmYears * freq;
    const couponPayment = (fv * annualCouponRate) / freq;

    // Approximate YTM Formula: [C + (F-P)/n] / [(F+P)/2]
    // C = Annual coupon payment
    // n = Years to maturity
    const annualC = fv * annualCouponRate;
    const ytmApprox = (annualC + ((fv - price) / ytmYears)) / ((fv + price) / 2);

    // Current Yield
    const currentYield = (annualC / price) * 100;

    // Generate price vs yield curve (Convexity visualization)
    // How price changes as required market yield changes
    const curveData = [];
    for (let yld = 0.01; yld <= 0.15; yld += 0.01) {
      let pv = 0;
      const ratePerPeriod = yld / freq;
      // PV of coupons
      for (let t = 1; t <= totalPeriods; t++) {
        pv += couponPayment / Math.pow(1 + ratePerPeriod, t);
      }
      // PV of face value
      pv += fv / Math.pow(1 + ratePerPeriod, totalPeriods);
      
      curveData.push({
        yield: parseFloat((yld * 100).toFixed(1)),
        yieldLabel: `${(yld * 100).toFixed(1)}%`,
        price: Math.round(pv)
      });
    }

    // Macaulay Duration Approximation (rough weighted average time)
    let macDurNum = 0;
    let macDurDen = 0;
    const currentYtmPerPeriod = ytmApprox / freq;
    
    for (let t = 1; t <= totalPeriods; t++) {
        const pvCashFlow = couponPayment / Math.pow(1 + currentYtmPerPeriod, t);
        macDurNum += (t / freq) * pvCashFlow;
        macDurDen += pvCashFlow;
    }
    const pvFace = fv / Math.pow(1 + currentYtmPerPeriod, totalPeriods);
    macDurNum += ytmYears * pvFace;
    macDurDen += pvFace;
    
    const macAulayDuration = macDurDen > 0 ? (macDurNum / macDurDen) : 0;
    const modifiedDuration = macAulayDuration / (1 + currentYtmPerPeriod);

    return { 
      ytmApprox: ytmApprox * 100, 
      currentYield, 
      annualC, 
      totalInterest: annualC * ytmYears,
      macAulayDuration,
      modifiedDuration,
      curveData
    };
  }, [faceValue, currentPrice, couponRate, yearsToMaturity, paymentFreq]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ChartIcon size={18} className="text-primary"/> Bond Parameters
          </h3>
          <div className="space-y-4">
             <InputField label="Face / Par Value" value={faceValue} onChange={setFaceValue} prefix="$" helpText="The principal amount repaid at maturity (typically $1,000 for standard corporate bonds)." />
             <InputField label="Current Market Price" value={currentPrice} onChange={setCurrentPrice} prefix="$" helpText="The current secondary market trading price. Determines if the bond trades at a premium or discount." />
             <InputField label="Annual Coupon Rate" value={couponRate} onChange={setCouponRate} suffix="%" helpText="The fixed annual interest rate paid by the issuer. Determines actual cash flow." />
             <InputField label="Years to Maturity" value={yearsToMaturity} onChange={setYearsToMaturity} suffix="yrs" helpText="Time remaining until the issuer repays the Face / Par Value." />
             <InputField label="Payment Frequency" value={paymentFreq} onChange={setPaymentFreq} helpText="How often interest is paid (e.g., Semi-Annual pays half the annual coupon twice a year)." options={[
               { value: '1', label: 'Annual (1x)' },
               { value: '2', label: 'Semi-Annual (2x)' },
               { value: '4', label: 'Quarterly (4x)' },
               { value: '12', label: 'Monthly (12x)' }
             ]} />
          </div>
          <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-primary font-bold">
            Bond is trading at a {parseFloat(currentPrice) < parseFloat(faceValue) ? 'discount' : parseFloat(currentPrice) > parseFloat(faceValue) ? 'premium' : 'par value'}.
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
           <ResultMetric label="Yield to Maturity (YTM)" value={fmtPct(result.ytmApprox)} large positive={result.ytmApprox > 3} />
           <ResultMetric label="Current Yield" value={fmtPct(result.currentYield)} neutral />
           <ResultMetric label="Total Interest Paid" value={fmtUSD(result.totalInterest)} positive />
           <ResultMetric label="Modified Duration" value={`${result.modifiedDuration.toFixed(2)} yrs`} neutral />
        </div>

        <Card className="flex-1 min-h-[350px] flex flex-col">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="font-bold text-lg mb-1">Price / Yield Convexity Curve</h3>
               <p className="text-xs text-text-muted">The non-linear relationship between bond prices and market interest rates.</p>
             </div>
             <div className="text-right text-xs">
                <span className="text-text-muted">Macaulay Duration:</span> <span className="font-bold">{result.macAulayDuration.toFixed(2)} yrs</span>
             </div>
           </div>
           
           <div className="flex-1 w-full bg-background/50 rounded-lg p-2 border border-border/50">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={result.curveData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                 <XAxis 
                   dataKey="yieldLabel" 
                   tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                   stroke="#3f3f46"
                   label={{ value: 'Market Interest Rate (Yield)', position: 'bottom', fill: '#a1a1aa', fontSize: 12 }} 
                 />
                 <YAxis 
                   domain={['auto', 'auto']} 
                   tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                   tickFormatter={v => `$${v}`} 
                   stroke="#3f3f46"
                   width={60}
                 />
                 <Tooltip itemStyle={{ color: '#e4e4e7' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number) => [fmtUSD(v), 'Bond Price']}
                   labelStyle={{ color: '#a1a1aa' }}
                 />
                 <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};

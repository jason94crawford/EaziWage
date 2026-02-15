import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, ArrowRight, Info, Check, Globe, Banknote,
  Clock, Shield, Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', symbol: 'KES', rate: 155 },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', symbol: 'UGX', rate: 3750 },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', symbol: 'TZS', rate: 2500 },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', symbol: 'RWF', rate: 1300 },
];

const paymentMethods = [
  { id: 'mobile_wallet', name: 'Mobile Wallet', countries: ['KE', 'TZ', 'UG', 'RW'] },
  { id: 'mtn', name: 'MTN Mobile Money', countries: ['UG', 'RW'] },
  { id: 'airtel', name: 'Airtel Money', countries: ['KE', 'UG', 'TZ', 'RW'] },
  { id: 'bank', name: 'Bank Transfer', countries: ['KE', 'UG', 'TZ', 'RW'] },
];

export default function CalculatorPage() {
  const [country, setCountry] = useState(countries[0]);
  const [grossSalary, setGrossSalary] = useState(50000);
  const [otherContributions, setOtherContributions] = useState(0);
  const [otherRemuneration, setOtherRemuneration] = useState(0);
  const [mealAllowance, setMealAllowance] = useState(0);
  const [nightAllowance, setNightAllowance] = useState(0);
  const [pensionCover, setPensionCover] = useState(0);
  const [medicalCover, setMedicalCover] = useState(0);
  const [daysWorked, setDaysWorked] = useState(12);
  const [totalDays, setTotalDays] = useState(28);

  const calculations = useMemo(() => {
    // Total earnings
    const totalEarnings = grossSalary + otherContributions + otherRemuneration + mealAllowance + nightAllowance;
    
    // Net after deductions
    const totalDeductions = pensionCover + medicalCover;
    const netSalary = totalEarnings - totalDeductions;
    
    // Daily rate
    const dailyRate = netSalary / totalDays;
    
    // Earned so far
    const earnedSoFar = dailyRate * daysWorked;
    
    // Accessible (60% of earned)
    const accessiblePercent = 0.6;
    const accessibleAmount = earnedSoFar * accessiblePercent;
    
    // Fee calculation (using 4.5% as average, $0.80 processing)
    const feePercent = 0.045; // 4.5% average
    const processingFee = 0.80; // $0.80 fixed
    const processingFeeLocal = processingFee * country.rate;
    const applicationFee = accessibleAmount * feePercent;
    const totalFee = applicationFee + processingFeeLocal;
    
    // Net receivable
    const netReceivable = accessibleAmount - totalFee;
    
    // Work cycle percentage
    const cyclePercent = Math.round((daysWorked / totalDays) * 100);
    
    return {
      totalEarnings,
      netSalary,
      dailyRate,
      earnedSoFar,
      accessibleAmount,
      applicationFee,
      processingFeeLocal,
      totalFee,
      netReceivable,
      cyclePercent,
      accessiblePercent: accessiblePercent * 100
    };
  }, [grossSalary, otherContributions, otherRemuneration, mealAllowance, nightAllowance, pensionCover, medicalCover, daysWorked, totalDays, country]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4 sm:mb-6">
              <Calculator className="w-4 h-4" />
              Smart Salary Insights
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Precision Wage.
              <br />
              <span className="text-gradient">Effortless Compliance.</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-2">
              The EaziWage Access Calculator helps employees estimate their accessible portion of earned wages before payday. It's clarity and confidence — simplified.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Input Form */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5 sm:mb-8">
                Wage Access Calculator
              </h2>
              
              {/* Country Selection */}
              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 block">Select Country</label>
                <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCountry(c)}
                      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all ${
                        country.code === c.code
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{c.flag}</span>
                      <span className={`text-xs sm:text-sm font-medium ${country.code === c.code ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                        {c.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Inputs */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                    Gross Monthly Salary ({country.symbol})
                  </label>
                  <Input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    placeholder="Enter gross salary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Other Contributions
                    </label>
                    <Input
                      type="number"
                      value={otherContributions}
                      onChange={(e) => setOtherContributions(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Other Remuneration
                    </label>
                    <Input
                      type="number"
                      value={otherRemuneration}
                      onChange={(e) => setOtherRemuneration(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Meal Allowance
                    </label>
                    <Input
                      type="number"
                      value={mealAllowance}
                      onChange={(e) => setMealAllowance(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Night Out Allowance
                    </label>
                    <Input
                      type="number"
                      value={nightAllowance}
                      onChange={(e) => setNightAllowance(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Pension Cover
                    </label>
                    <Input
                      type="number"
                      value={pensionCover}
                      onChange={(e) => setPensionCover(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                      Medical Cover
                    </label>
                    <Input
                      type="number"
                      value={medicalCover}
                      onChange={(e) => setMedicalCover(Number(e.target.value))}
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Days Worked Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Days Worked
                    </label>
                    <span className="text-xs sm:text-sm font-bold text-primary">
                      {daysWorked} / {totalDays} days • {calculations.cyclePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={totalDays}
                    value={daysWorked}
                    onChange={(e) => setDaysWorked(Number(e.target.value))}
                    className="w-full h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2">
                    <span>1 day</span>
                    <span>{totalDays} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-primary via-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Banknote className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium opacity-80">Accessible Amount</span>
                </div>
                <div className="mb-4 sm:mb-6">
                  <p className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2 break-all">
                    {country.symbol} {formatCurrency(calculations.accessibleAmount)}
                  </p>
                  <p className="text-xs sm:text-sm opacity-70">
                    Based on {calculations.accessiblePercent}% of earned wages
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-white/20">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-70">Earned So Far</span>
                    <span className="font-semibold">{country.symbol} {formatCurrency(calculations.earnedSoFar)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-70">App Fee (~4.5%)</span>
                    <span className="font-semibold">- {country.symbol} {formatCurrency(calculations.applicationFee)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-70">Processing ($0.80)</span>
                    <span className="font-semibold">- {country.symbol} {formatCurrency(calculations.processingFeeLocal)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm pt-2 sm:pt-3 border-t border-white/20">
                    <span className="font-semibold">You Receive</span>
                    <span className="font-bold text-base sm:text-lg">{country.symbol} {formatCurrency(calculations.netReceivable)}</span>
                  </div>
                </div>
              </div>

              {/* Fee Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Info className="w-4 h-4 text-primary" />
                  Fee Structure
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Application Fee</span>
                    <span className="font-medium text-slate-900 dark:text-white">3.5% - 6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Processing Fee</span>
                    <span className="font-medium text-slate-900 dark:text-white">$0.80/transaction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Interest</span>
                    <span className="font-medium text-primary">0%</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
                  Ready to access your earned wages?
                </p>
                <Link to="/register?role=employee">
                  <Button className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white text-sm sm:text-base">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-primary/5 dark:bg-primary/10 rounded-lg sm:rounded-xl border border-primary/20 dark:border-primary/30">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-primary">Note:</strong> The calculated figure is an estimate for informational purposes only. 
              Actual amounts depend on payroll verification, residency, and EaziWage eligibility requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 sm:py-16 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
            <span className="text-primary font-semibold">Precision builds trust.</span> Trust drives growth.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 dark:bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Instant</p>
                <p className="text-xs sm:text-sm text-slate-500">Under 3 seconds</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 dark:bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Secure</p>
                <p className="text-xs sm:text-sm text-slate-500">Bank-grade encryption</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 dark:bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">24/7</p>
                <p className="text-xs sm:text-sm text-slate-500">Always available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

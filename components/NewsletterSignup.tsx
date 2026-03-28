
import React, { useState, useCallback } from 'react';
import { Mail, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useAppContext } from '../context/AppContext';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact';
  onSubscribe?: (email: string) => Promise<void>;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className = '',
  variant = 'default',
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const { addToast } = useAppContext();

  const validateEmail = useCallback((email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    if (email.length > 254) return 'Email is too long';
    return null;
  }, []);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateEmail(email));
  }, [email, validateEmail]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (touched) {
      setError(validateEmail(newEmail));
    }
  }, [touched, validateEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      // Show success toast
      addToast('Thanks for subscribing! Please check your email to confirm.', 'success', 4000);
      setEmail('');
      setTouched(false);
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Subscription failed. Please try again.');
      addToast('Subscription failed. Please try again later.', 'error', 4000);
      console.error('Newsletter subscription error:', err);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`leather-card rounded-xl p-6 w-full max-w-lg mx-auto ${className}`}>
        <div className="flex flex-col items-start gap-6 w-full">
          {/* Top: Icon + Text */}
          <div className="flex items-center gap-4 w-full">
            <div className="p-3 bg-primary/10 rounded-lg relative z-10 flex-shrink-0">
              <Mail size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-bold text-base text-white truncate">Wall Street Reads Crypto</h4>
              <p className="text-text-muted text-sm truncate">Weekly digest. No spam.</p>
            </div>
          </div>

          {/* Bottom: Form */}
          <form onSubmit={handleSubmit} className="flex flex-row items-stretch gap-3 w-full relative z-10">
            <div className="flex-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full h-12 bg-background border rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    error && touched ? 'border-red-500' : 'border-border'
                  }`}
                  aria-label="Email address for newsletter subscription"
                  required
                />
            </div>
            <Button 
              type="submit" 
              size="md"
              disabled={isSubmitting || isSuccess}
              className="h-12 whitespace-nowrap flex-shrink-0 px-6"
              aria-label={isSuccess ? 'Successfully subscribed' : 'Subscribe'}
            >
              {isSuccess ? <Check size={20} /> : isSubmitting ? '...' : 'Subscribe'}
            </Button>
          </form>
        </div>
        {/* Error message */}
        {error && touched && (
            <div className="text-left w-full text-red-500 text-xs flex items-center justify-start gap-1 mt-2">
                <AlertCircle size={12} />
                {error}
            </div>
        )}
      </div>
    );
  }

  return (
    <section className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background ${className}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      
      <div className="relative z-10 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Free Weekly Digest</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Wall Street Reads Crypto
          </h2>
          
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Get the top 3 crypto stories each Monday, explained in traditional finance terms. No jargon. No hype. Just analysis.
          </p>
          
          {isSuccess ? (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 max-w-md mx-auto" role="status" aria-live="polite">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check size={24} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">You're subscribed!</h3>
              <p className="text-text-muted">
                Check your inbox for the confirmation email. Your first issue arrives next Monday.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto" aria-label="Newsletter subscription form">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your professional email"
                      value={email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-background border rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        error && touched ? 'border-red-500' : 'border-border'
                      }`}
                      aria-label="Professional email address"
                      aria-invalid={error && touched ? 'true' : 'false'}
                      aria-describedby={error && touched ? 'email-error' : undefined}
                      required
                    />
                    {error && touched && (
                      <div id="email-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {error}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting || isSuccess || (touched && !!error)}
                  className="whitespace-nowrap min-w-[140px]"
                  aria-label={isSuccess ? 'Successfully subscribed' : 'Get free newsletter issues'}
                >
                  {isSuccess ? <Check size={20} aria-hidden="true" /> : isSubmitting ? 'Subscribing...' : 'Get Free Issues'}
                </Button>
              </div>
              {error && touched ? (
                <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </p>
              ) : (
                <p className="text-text-muted text-sm mt-3">
                  Join 15,000+ finance professionals. Unsubscribe anytime.
                </p>
              )}
            </form>
          )}
          
          <div className="mt-8 pt-8 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm" role="list" aria-label="Newsletter statistics">
                <div className="text-center" role="listitem">
                  <div className="text-primary font-bold text-lg mb-1" aria-label="15,000 plus">15K+</div>
                  <div className="text-text-muted">Finance Professionals</div>
                </div>
                <div className="text-center" role="listitem">
                  <div className="text-primary font-bold text-lg mb-1" aria-label="92 percent">92%</div>
                  <div className="text-text-muted">Open Rate</div>
                </div>
                <div className="text-center" role="listitem">
                  <div className="text-primary font-bold text-lg mb-1" aria-label="Free">Free</div>
                  <div className="text-text-muted">Always No Cost</div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

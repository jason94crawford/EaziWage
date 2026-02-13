import { useState, useEffect, useRef } from 'react';

// Hook to detect when element is in viewport
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Once animated, stop observing
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

// Animated counter component
export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  startOnView = true 
}) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if ((startOnView && !isInView) || hasAnimated) return;

    setHasAnimated(true);
    const startTime = Date.now();
    const startValue = 0;
    const endValue = parseFloat(end.toString().replace(/[^0-9.]/g, ''));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, startOnView, hasAnimated]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={ref}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

// Stat card with animated counter
export function AnimatedStatCard({ value, label, icon: Icon, suffix = '', prefix = '' }) {
  const [ref, isInView] = useInView();
  
  // Extract numeric value
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const hasK = value.includes('K');
  const hasM = value.includes('M');
  const hasB = value.includes('B');
  const hasPlus = value.includes('+');
  
  let displaySuffix = suffix;
  if (hasK) displaySuffix = 'K' + (hasPlus ? '+' : '');
  else if (hasM) displaySuffix = 'M' + (hasPlus ? '+' : '');
  else if (hasB) displaySuffix = 'B+';
  else if (hasPlus) displaySuffix = '+';

  return (
    <div ref={ref} className="text-center">
      {Icon && <Icon className="w-10 h-10 text-primary mx-auto mb-4" />}
      <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
        {prefix}
        <AnimatedCounter 
          end={numericValue} 
          duration={2500} 
          suffix={displaySuffix}
          startOnView={true}
        />
      </p>
      <p className="text-slate-400">{label}</p>
    </div>
  );
}

export default AnimatedCounter;

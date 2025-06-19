import React, { useState, useEffect } from 'react';

const VignanLogoAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase(1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="relative">
        {/* Vignan Logo */}
        <div 
          className={`relative -mb-40 -ml-40 mr-40 transition-all duration-1000 ease-out ${
            animationPhase >= 1 ? 'scale-50 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'
          }`}
          style={{
            transitionDelay: '0s'
          }}
        >
          <img 
            src="https://vignan.ac.in/newvignan/assets/images/mobile-logo.svg"
            alt="Vignan Logo"
            className=" mb-10 pb-3 pl-10 w-22 h-auto drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          
          {/* Fallback SVG if image fails to load */}
          <div className="hidden">
            <svg width="200" height="200" viewBox="0 0 120 120" className="drop-shadow-lg">
              <rect width="200" height="200" fill="#3B82F6" rx="15"/>
              <text x="60" y="70" textAnchor="middle" fill="white" className='-mt-10' fontSize="20" fontWeight="bold">
                VIGNAN
              </text>
            </svg>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-4">
          <h1 
            className={`text-7xl ml-20 font-bold tracking-wider transition-all duration-1000 ease-out ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              color: '#DC2626',
              transitionDelay: '0.8s',
              fontFamily: 'Arial Black, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            VIGNAN'S
          </h1>
        </div>

        {/* Subtitle */}
        <div 
          className={`text-center mb-4 transition-all duration-1000 ease-out ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1.2s' }}
        >
          <p className="text-lg font-semibold text-gray-800 tracking-wide">
            FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH
          </p>
        </div>

        {/* Bottom Banner */}
        <div 
          className={`bg-blue-500 text-white text-center py-3 px-8 rounded-lg shadow-lg transition-all duration-1000 ease-out ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{ transitionDelay: '1.6s' }}
        >
          <p className="font-medium">
            (Deemed to be University) - Estd. u/s 3 of UGC Act 1956
          </p>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-blue-400 rounded-full transition-all duration-2000 ease-out ${
                animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 80}%`,
                transitionDelay: `${2 + i * 0.1}s`,
                animation: animationPhase >= 1 ? `float-${i} 3s infinite ease-in-out` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(360deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-360deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(180deg); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(-180deg); }
        }
      `}</style>
    </div>
  );
};

export default VignanLogoAnimation;
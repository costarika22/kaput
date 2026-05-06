import Image from 'next/image';
import { Scenario } from '@/types';

interface SplashScreenProps {
  scenario: Scenario;
}

export default function SplashScreen({ scenario }: SplashScreenProps) {
  return (
    <div
      className="min-h-screen animated-gradient"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div style={{ flex: 1 }} />

        {/* Monkey + Logo composition: monkey behind, logo in front */}
        <div className="flex flex-col items-center">
          <div style={{ marginBottom: '-40px', zIndex: 0, position: 'relative' }}>
            <Image
              src="/neutral.png"
              alt="Kaput the monkey"
              width={220}
              height={220}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-bangers), Impact, sans-serif',
              fontSize: '120px',
              lineHeight: 1,
              color: '#0a0a0a',
              WebkitTextStroke: '6px white',
              paintOrder: 'stroke fill',
              letterSpacing: '4px',
              margin: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            KAPUT
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '14px',
              letterSpacing: '4px',
              color: 'rgba(0,0,0,0.4)',
              marginTop: '16px',
              textTransform: 'uppercase',
            }}
          >
            Daily Survival Game
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <div className="flex items-center gap-2 pb-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.25)',
                animation: 'bounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

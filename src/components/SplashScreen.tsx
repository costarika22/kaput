import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between"
      style={{
        background: 'linear-gradient(160deg, #b8d4e8 0%, #e8f4f8 100%)',
      }}
    >
      {/* Spacer */}
      <div className="flex-1" />

      {/* Monkey + Logo composition */}
      <div className="flex flex-col items-center">
        {/* Monkey overlapping the logo */}
        <div style={{ marginBottom: '-40px', zIndex: 1, position: 'relative' }}>
          <Image
            src="/neutral.png"
            alt="Kaput the monkey"
            width={220}
            height={220}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* KAPUT logo */}
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
            zIndex: 0,
          }}
        >
          KAPUT
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '14px',
            letterSpacing: '4px',
            color: '#6a8a9a',
            marginTop: '16px',
            textTransform: 'uppercase',
          }}
        >
          Daily Survival Game
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Pulsing dots */}
      <div className="flex items-center gap-2 pb-12">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#6a8a9a',
              animation: 'bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

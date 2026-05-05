'use client';

import { MonkeyMood } from '@/types';

interface MonkeyProps {
  mood: MonkeyMood;
  size?: number;
  className?: string;
}

export function getMoodFromScore(days: number): MonkeyMood {
  if (days <= 30) return 'devastated';
  if (days <= 80) return 'disappointed';
  if (days <= 150) return 'neutral';
  if (days <= 250) return 'impressed';
  return 'euphoric';
}

// Monkey SVG — painterly cartoon style with expressive wide eyes
export default function MonkeyExpression({ mood, size = 200, className = '' }: MonkeyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Monkey expression: ${mood}`}
    >
      {/* Body / torso */}
      <ellipse cx="100" cy="155" rx="38" ry="32" fill="#8B5E3C" />
      <ellipse cx="100" cy="158" rx="22" ry="20" fill="#D4956A" />

      {/* Ears */}
      <ellipse cx="44" cy="92" rx="18" ry="20" fill="#8B5E3C" />
      <ellipse cx="44" cy="92" rx="11" ry="13" fill="#D4956A" />
      <ellipse cx="156" cy="92" rx="18" ry="20" fill="#8B5E3C" />
      <ellipse cx="156" cy="92" rx="11" ry="13" fill="#D4956A" />

      {/* Head */}
      <ellipse cx="100" cy="88" rx="52" ry="56" fill="#8B5E3C" />

      {/* Fur texture patches */}
      <ellipse cx="80" cy="68" rx="8" ry="6" fill="#7A5230" opacity="0.4" />
      <ellipse cx="122" cy="72" rx="6" ry="5" fill="#7A5230" opacity="0.3" />
      <ellipse cx="95" cy="58" rx="5" ry="4" fill="#9B6E4C" opacity="0.5" />

      {/* Face plate */}
      <ellipse cx="100" cy="100" rx="34" ry="30" fill="#D4956A" />

      {/* Nose */}
      <ellipse cx="100" cy="108" rx="10" ry="7" fill="#B07050" />
      <circle cx="96" cy="107" r="3" fill="#1a0a00" />
      <circle cx="104" cy="107" r="3" fill="#1a0a00" />
      <circle cx="97" cy="106" r="1" fill="white" opacity="0.6" />
      <circle cx="105" cy="106" r="1" fill="white" opacity="0.6" />

      {/* Mood-specific eyes and mouth */}
      {mood === 'devastated' && <DevastatedFace />}
      {mood === 'disappointed' && <DisappointedFace />}
      {mood === 'neutral' && <NeutralFace />}
      {mood === 'impressed' && <ImpressedFace />}
      {mood === 'euphoric' && <EuphoricFace />}

      {/* Eyebrows layer */}
      {mood === 'devastated' && <DevastatedBrows />}
      {mood === 'disappointed' && <DisappointedBrows />}
      {mood === 'neutral' && <NeutralBrows />}
      {mood === 'impressed' && <ImpressedBrows />}
      {mood === 'euphoric' && <EuphoricBrows />}

      {/* Head fur top */}
      <ellipse cx="100" cy="38" rx="28" ry="14" fill="#7A5230" />
      <ellipse cx="82" cy="42" rx="10" ry="8" fill="#6A4520" />
      <ellipse cx="118" cy="42" rx="10" ry="8" fill="#6A4520" />
      <ellipse cx="100" cy="36" rx="14" ry="8" fill="#8B5E3C" />
    </svg>
  );
}

function DevastatedFace() {
  return (
    <g>
      {/* Wide horrified eyes with tears */}
      <ellipse cx="82" cy="88" rx="13" ry="14" fill="white" />
      <ellipse cx="118" cy="88" rx="13" ry="14" fill="white" />
      <circle cx="82" cy="91" r="8" fill="#1a0a00" />
      <circle cx="118" cy="91" r="8" fill="#1a0a00" />
      <circle cx="79" cy="88" r="3" fill="white" opacity="0.8" />
      <circle cx="115" cy="88" r="3" fill="white" opacity="0.8" />
      {/* Tiny pupils of despair */}
      <circle cx="83" cy="92" r="3" fill="#3a1a00" />
      <circle cx="119" cy="92" r="3" fill="#3a1a00" />
      {/* Tears */}
      <path d="M76 96 Q74 104 76 112" stroke="#6ab0e0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M124 96 Q126 104 124 112" stroke="#6ab0e0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="76" cy="113" rx="2.5" ry="3.5" fill="#6ab0e0" opacity="0.8" />
      <ellipse cx="124" cy="113" rx="2.5" ry="3.5" fill="#6ab0e0" opacity="0.8" />
      {/* Gaping grimace mouth */}
      <path d="M84 118 Q100 112 116 118" stroke="#6a3a20" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M88 119 Q100 128 112 119" fill="#3a1a10" />
      <path d="M90 120 Q100 124 110 120" fill="#c05050" opacity="0.6" />
    </g>
  );
}

function DisappointedFace() {
  return (
    <g>
      {/* Half-lidded resigned eyes */}
      <ellipse cx="82" cy="88" rx="12" ry="11" fill="white" />
      <ellipse cx="118" cy="88" rx="12" ry="11" fill="white" />
      <circle cx="82" cy="90" r="7" fill="#1a0a00" />
      <circle cx="118" cy="90" r="7" fill="#1a0a00" />
      <circle cx="79" cy="87" r="2.5" fill="white" opacity="0.8" />
      <circle cx="115" cy="87" r="2.5" fill="white" opacity="0.8" />
      {/* Heavy lids */}
      <path d="M70 83 Q82 78 94 83" fill="#8B5E3C" />
      <path d="M106 83 Q118 78 130 83" fill="#8B5E3C" />
      {/* Flat disappointed mouth */}
      <path d="M87 120 Q100 117 113 120" stroke="#6a3a20" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M87 120 Q88 124 91 123" stroke="#6a3a20" strokeWidth="2" fill="none" />
      <path d="M113 120 Q112 124 109 123" stroke="#6a3a20" strokeWidth="2" fill="none" />
    </g>
  );
}

function NeutralFace() {
  return (
    <g>
      {/* Medium, slightly bored eyes */}
      <ellipse cx="82" cy="88" rx="11" ry="11" fill="white" />
      <ellipse cx="118" cy="88" rx="11" ry="11" fill="white" />
      <circle cx="82" cy="89" r="7" fill="#1a0a00" />
      <circle cx="118" cy="89" r="7" fill="#1a0a00" />
      <circle cx="79" cy="86" r="2.5" fill="white" opacity="0.8" />
      <circle cx="115" cy="86" r="2.5" fill="white" opacity="0.8" />
      {/* Perfectly flat mouth — not impressed, not upset */}
      <path d="M88 120 L112 120" stroke="#6a3a20" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function ImpressedFace() {
  return (
    <g>
      {/* Wider alert eyes */}
      <ellipse cx="82" cy="87" rx="13" ry="13" fill="white" />
      <ellipse cx="118" cy="87" rx="13" ry="13" fill="white" />
      <circle cx="82" cy="88" r="8" fill="#1a0a00" />
      <circle cx="118" cy="88" r="8" fill="#1a0a00" />
      <circle cx="78" cy="84" r="3" fill="white" opacity="0.9" />
      <circle cx="114" cy="84" r="3" fill="white" opacity="0.9" />
      {/* Slight upward mouth — controlled, barely approving */}
      <path d="M88 120 Q100 126 112 120" stroke="#6a3a20" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function EuphoricFace() {
  return (
    <g>
      {/* Giant sparkling eyes — shocked delight */}
      <ellipse cx="82" cy="86" rx="15" ry="15" fill="white" />
      <ellipse cx="118" cy="86" rx="15" ry="15" fill="white" />
      <circle cx="82" cy="87" r="10" fill="#1a0a00" />
      <circle cx="118" cy="87" r="10" fill="#1a0a00" />
      <circle cx="77" cy="82" r="4" fill="white" opacity="0.9" />
      <circle cx="113" cy="82" r="4" fill="white" opacity="0.9" />
      <circle cx="85" cy="90" r="2" fill="white" opacity="0.5" />
      <circle cx="121" cy="90" r="2" fill="white" opacity="0.5" />
      {/* Sparkles */}
      <path d="M68 72 L70 66 L72 72 L66 70 L72 70" fill="#FFD700" opacity="0.9" />
      <path d="M130 68 L132 63 L134 68 L128 66 L134 66" fill="#FFD700" opacity="0.9" />
      {/* Big wide grin — reluctantly delighted */}
      <path d="M83 118 Q100 132 117 118" fill="#3a1a10" />
      <path d="M83 118 Q100 116 117 118" stroke="#6a3a20" strokeWidth="2.5" fill="none" />
      <path d="M86 120 Q100 128 114 120" fill="#c05050" opacity="0.7" />
      {/* Teeth */}
      <path d="M89 119 L89 125 L95 125 L95 119" fill="white" opacity="0.9" />
      <path d="M97 119 L97 126 L103 126 L103 119" fill="white" opacity="0.9" />
      <path d="M105 119 L105 125 L111 125 L111 119" fill="white" opacity="0.9" />
    </g>
  );
}

function DevastatedBrows() {
  return (
    <g>
      <path d="M70 76 Q82 68 90 74" stroke="#4a2a10" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M110 74 Q118 68 130 76" stroke="#4a2a10" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

function DisappointedBrows() {
  return (
    <g>
      <path d="M70 79 Q82 74 92 78" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M108 78 Q118 74 130 79" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function NeutralBrows() {
  return (
    <g>
      <path d="M71 78 Q82 76 93 78" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M107 78 Q118 76 129 78" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function ImpressedBrows() {
  return (
    <g>
      <path d="M70 76 Q82 70 93 75" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M107 75 Q118 70 130 76" stroke="#4a2a10" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function EuphoricBrows() {
  return (
    <g>
      <path d="M69 73 Q82 65 93 71" stroke="#4a2a10" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M107 71 Q118 65 131 73" stroke="#4a2a10" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

'use client';

import Image from 'next/image';
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

export default function MonkeyExpression({ mood, size = 200, className = '' }: MonkeyProps) {
  return (
    <Image
      src={`/${mood}.png`}
      alt={`Monkey expression: ${mood}`}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
      priority
    />
  );
}

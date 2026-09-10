'use client';
import { cn } from '@/lib/utils';
import React from 'react';

export function BuyMeCoffee({
  classname,
  iconClassName,
  textSvgClassName,
}: {
  classname?: string;
  iconClassName?: string;
  textSvgClassName?: string;
}) {
  return (
    <a
      href='https://buymeacoffee.com/'
      target='_blank'
      rel='noreferrer noopener'
      className={cn(
        'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#FFDD00] px-6 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md',
        classname
      )}
    >
      <svg
        className={cn("w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12", iconClassName)}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
      </svg>
      <span className={cn("font-mono tracking-tight text-sm uppercase", textSvgClassName)}>Buy me a coffee</span>
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="relative h-full w-12 bg-white/40" />
      </div>
    </a>
  );
}

import React from 'react';
import { Dog, Cat, Bird, Shield, Activity, Sparkles, Heart } from 'lucide-react';
import { SpeciesType } from '../../types';

interface AnimalIllustrationProps {
  species: SpeciesType | string;
  className?: string;
}

export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({ species, className = 'w-8 h-8' }) => {
  const s = species.toLowerCase();

  if (s.includes('dog') || s.includes('canine')) {
    return <Dog className={className} />;
  }
  if (s.includes('cat') || s.includes('feline')) {
    return <Cat className={className} />;
  }
  if (s.includes('bird') || s.includes('avian')) {
    return <Bird className={className} />;
  }
  if (s.includes('horse') || s.includes('equine')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18l3-6 4-2 3-5 5 1-1 4 3 2v6l-4 2-4-2H4z" />
        <circle cx="16" cy="7" r="1" />
      </svg>
    );
  }
  if (s.includes('cattle') || s.includes('bovine')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8l3 4 5-1 5 1 3-4" />
        <path d="M7 12v6a5 5 0 0 0 10 0v-6" />
        <circle cx="9" cy="15" r="1" />
        <circle cx="15" cy="15" r="1" />
      </svg>
    );
  }
  return <Heart className={className} />;
};

export const SpeciesBadge: React.FC<{ species: SpeciesType | string }> = ({ species }) => {
  const s = species.toLowerCase();
  let color = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';

  if (s.includes('canine') || s.includes('dog')) {
    color = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  } else if (s.includes('feline') || s.includes('cat')) {
    color = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
  } else if (s.includes('equine') || s.includes('horse')) {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
  } else if (s.includes('avian') || s.includes('bird')) {
    color = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <AnimalIllustration species={species} className="w-3.5 h-3.5" />
      <span>{species}</span>
    </span>
  );
};

export const AnimalAvatar: React.FC<{
  species: SpeciesType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ species, size = 'md' }) => {
  const s = species.toLowerCase();
  let bg = 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800';

  if (s.includes('dog') || s.includes('canine')) {
    bg = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  } else if (s.includes('cat') || s.includes('feline')) {
    bg = 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
  } else if (s.includes('horse') || s.includes('equine')) {
    bg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  } else if (s.includes('bird') || s.includes('avian')) {
    bg = 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800';
  }

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl p-1.5',
    md: 'w-12 h-12 rounded-2xl p-2.5',
    lg: 'w-16 h-16 rounded-3xl p-3.5',
    xl: 'w-20 h-20 rounded-3xl p-4',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }[size];

  return (
    <div className={`flex items-center justify-center border shadow-xs ${bg} ${sizeClasses}`}>
      <AnimalIllustration species={species} className={iconSizes} />
    </div>
  );
};


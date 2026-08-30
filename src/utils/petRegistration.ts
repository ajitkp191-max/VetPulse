import { SpeciesType } from '../types';

/**
 * Generates an animal-specific default registration number according to species taxonomy and year.
 * Examples:
 * - Canine (Dog): CAN-2026-8492
 * - Feline (Cat): FEL-2026-3829
 * - Equine (Horse): EQ-2026-1102
 * - Bovine (Cattle): BOV-2026-5541
 * - Avian (Bird): AVI-2026-9281
 * - Small Mammal / Rabbit: MAM-2026-4410
 * - Reptile: REP-2026-7731
 * - Other: VET-2026-6204
 */
export function generateAnimalRegistrationNumber(species: string = 'Canine (Dog)'): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  
  let prefix = 'VET';
  const lower = species.toLowerCase();

  if (lower.includes('dog') || lower.includes('canine')) {
    prefix = 'CAN';
  } else if (lower.includes('cat') || lower.includes('feline')) {
    prefix = 'FEL';
  } else if (lower.includes('horse') || lower.includes('equine')) {
    prefix = 'EQ';
  } else if (lower.includes('cattle') || lower.includes('bovine') || lower.includes('cow')) {
    prefix = 'BOV';
  } else if (lower.includes('bird') || lower.includes('avian') || lower.includes('parrot')) {
    prefix = 'AVI';
  } else if (lower.includes('mammal') || lower.includes('rabbit') || lower.includes('hamster') || lower.includes('guinea')) {
    prefix = 'MAM';
  } else if (lower.includes('reptile') || lower.includes('turtle') || lower.includes('snake') || lower.includes('lizard')) {
    prefix = 'REP';
  } else {
    prefix = 'EXO';
  }

  return `${prefix}-${currentYear}-${randomSuffix}`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

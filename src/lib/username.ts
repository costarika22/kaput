const ADJECTIVES = [
  'Chaos', 'Grim', 'Furious', 'Feral', 'Rogue', 'Dire', 'Savage', 'Wicked',
  'Rabid', 'Cursed', 'Maniac', 'Phantom', 'Sinister', 'Vile', 'Mad', 'Dark',
  'Iron', 'Bleak', 'Doom', 'Gloomy', 'Twisted', 'Brutal', 'Hollow', 'Ruined',
  'Frantic', 'Deranged', 'Sullen', 'Grizzled', 'Menacing', 'Haunted',
  'Shambling', 'Desolate', 'Unhinged', 'Foul', 'Dreary', 'Blighted',
];

const ANIMALS = [
  'Llama', 'Tapir', 'Banana', 'Gibbon', 'Wombat', 'Mongoose', 'Capybara',
  'Narwhal', 'Pangolin', 'Axolotl', 'Platypus', 'Quokka', 'Okapi', 'Manatee',
  'Flamingo', 'Badger', 'Wolverine', 'Ocelot', 'Meerkat', 'Armadillo',
  'Hyena', 'Jackal', 'Vulture', 'Possum', 'Weasel', 'Ferret', 'Gecko',
  'Iguana', 'Dingo', 'Albatross', 'Pelican', 'Condor', 'Ibis', 'Chameleon',
];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
}

export function getUsername(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('kaput_username');
  if (stored) return stored;
  const generated = generateUsername();
  localStorage.setItem('kaput_username', generated);
  return generated;
}

export function setUsername(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kaput_username', name);
}

export function getTodayAttemptCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toISOString().split('T')[0];
  const key = `kaput_attempts_${today}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function incrementTodayAttemptCount(): number {
  if (typeof window === 'undefined') return 1;
  const today = new Date().toISOString().split('T')[0];
  const key = `kaput_attempts_${today}`;
  const next = getTodayAttemptCount() + 1;
  localStorage.setItem(key, String(next));
  return next;
}

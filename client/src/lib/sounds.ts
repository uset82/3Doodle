import { Howl } from 'howler';

// Map of object types to their sound files
const SOUND_MAP: Record<string, string> = {
  // Common objects
  apple: 'https://assets.coderrocketfuel.com/pomodoro-times-up.mp3', // Crunch sound
  banana: 'https://assets.coderrocketfuel.com/pomodoro-times-up.mp3', // Peel sound
  cat: 'https://soundbible.com/mp3/Cat_Meowing-Mr_Smith-780889994.mp3', // Meow
  dog: 'https://soundbible.com/mp3/Dog_Bark-Public_Domain-112624444.mp3', // Bark
  flower: 'https://soundbible.com/mp3/Blop-Mark_DiAngelo-79054334.mp3', // Rustling
  sun: 'https://soundbible.com/mp3/Campfire-SoundBible.com-56731569.mp3', // Warm sound
  table: 'https://soundbible.com/mp3/Glass_Ping-Go445-1207030150.mp3', // Knock
  house: 'https://soundbible.com/mp3/doorbell-Andrew_Kenneally-667897870.mp3', // Doorbell
  
  // Fallback sound for unrecognized objects
  default: 'https://soundbible.com/mp3/Click-SoundBible.com-1387633738.mp3'
};

// Cache sounds to avoid reloading
const soundCache: Record<string, Howl> = {};

export const preloadSounds = () => {
  Object.entries(SOUND_MAP).forEach(([type, url]) => {
    soundCache[type] = new Howl({
      src: [url],
      preload: true,
    });
  });
};

export const playSound = (objectType: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Normalize object type: lowercase and remove plurals
    const normalizedType = objectType.toLowerCase().replace(/s$/, '');
    
    // Get sound URL, fallback to default if not found
    const soundUrl = SOUND_MAP[normalizedType] || SOUND_MAP.default;
    
    // Use cached sound or create a new one
    if (!soundCache[normalizedType]) {
      soundCache[normalizedType] = new Howl({
        src: [soundUrl],
        onplay: () => {
          console.log(`Playing sound for: ${normalizedType}`);
        },
        onend: () => {
          resolve();
        },
        onloaderror: (id, error) => {
          console.error(`Error loading sound for ${normalizedType}:`, error);
          reject(error);
        },
        onplayerror: (id, error) => {
          console.error(`Error playing sound for ${normalizedType}:`, error);
          reject(error);
        }
      });
    }
    
    // Play the sound
    soundCache[normalizedType].play();
  });
};

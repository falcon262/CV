/** "Before enterprise software" (docs/brief.md, section 10). */
import type { ImageMetadata } from 'astro';
import parcSandbox from '../assets/lab/parc-robotics-sandbox.png';
import katapultMauritius from '../assets/lab/katapult-mauritius.png';
import geospatial from '../assets/lab/3d-geospatial-visualisation.png';
import ghanaTechLab from '../assets/lab/ghana-tech-lab-office-tour.png';
import heroesOfThePast from '../assets/lab/heroes-of-the-past.png';
import goldCoast from '../assets/lab/gold-coast.png';

export interface LabEntry {
  title: string;
  sentence: string;
  image?: { src: ImageMetadata; alt: string };
}

export const lab: LabEntry[] = [
  {
    title: 'PARC Robotics virtual sandbox',
    sentence:
      "The Pan-African Robotics Competition sandbox, shipped as a Unity WebGL build with a block-based visual scripting engine, profiled for build size, load time and memory so it ran well in students’ browsers.",
    image: {
      src: parcSandbox,
      alt: 'A block-based script beside a robot on a 3D competition mat.',
    },
  },
  {
    title: 'Katapult Mauritius',
    sentence: "The same visual scripting platform, used for PARC Robotics’ programme in Mauritius.",
    image: {
      src: katapultMauritius,
      alt: 'Visual scripting blocks dressing a 3D character in a hard hat and safety vest.',
    },
  },
  {
    title: '3D geospatial visualisation',
    sentence: 'A 3D GPS visualisation built from photogrammetry.',
    image: {
      src: geospatial,
      alt: 'A 3D campus map with a walking route, beside views of a modelled engineering school building.',
    },
  },
  {
    title: 'Ghana Tech Lab 3D office tour',
    sentence: 'An interactive 3D tour of the Ghana Tech Lab office.',
    image: {
      src: ghanaTechLab,
      alt: 'A 3D walkthrough of an office corridor lined with glass-walled meeting rooms.',
    },
  },
  {
    title: 'Heroes of the Past',
    sentence: 'A Unity game that tells African history through interactive storytelling.',
    image: {
      src: heroesOfThePast,
      alt: 'Two game characters facing each other on glowing platforms: a colonial officer and an African warrior.',
    },
  },
  {
    title: 'Gold Coast',
    sentence: "An educational Unity game about Ghana’s colonial history and the road to independence.",
    image: {
      src: goldCoast,
      alt: 'The gates of Jubilee House rendered in 3D at dusk.',
    },
  },
  {
    title: 'Sucasa Ghana VR walkthrough',
    sentence: 'A virtual reality property walkthrough for a real estate developer.',
  },
  {
    title: 'Talk: AI in Gaming and Real-World Simulations',
    sentence: 'AI in Tech Stakeholders Summit, Ghana Tech Lab, 2019.',
  },
  {
    title: 'Degraded Redundancy',
    sentence:
      'An animated board-level cyber-crisis simulation film, made with a zero-budget AI pipeline (Revideo, Kokoro TTS, LTX-Video, DaVinci Resolve).',
  },
];

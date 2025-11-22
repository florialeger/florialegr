import React from 'react';
import PropTypes from 'prop-types';
import AppleSrc from '@/assets/icons/Apple-icone.png';
import CognitiveSrc from '@/assets/icons/Cognitive-science-icone.png';
import ComputerSrc from '@/assets/icons/Computer-icone.png';
import CSSSrc from '@/assets/icons/CSS-icone.png';
import DrawSrc from '@/assets/icons/Draw-icone.png';
import FigmaSrc from '@/assets/icons/figma-icone.png';
import FlagSrc from '@/assets/icons/Bordeaux-icone.png';
import HTMLSrc from '@/assets/icons/HTML-icone.png';
import LinkedinSrc from '@/assets/icons/linkedin.png';
import GitHubSrc from '@/assets/icons/github.png';
import BentoSrc from '@/assets/icons/bento.png';
import ArtstationSrc from '@/assets/icons/Artstation.png';
import LayersSrc from '@/assets/icons/layers.png';
import TwitterSrc from '@/assets/icons/twitter.png';
import Pencil from '@/assets/icons/Paper-icone.png';
import ProcreateSrc from '@/assets/icons/Procreate-icone.png';
import ReactSrc from '@/assets/icons/React-icone.png';
import UXSrc from '@/assets/icons/UX-design-icone.png';
import VolleySrc from '@/assets/icons/Volley-icone.png';
import VScodeSrc from '@/assets/icons/VScode-icone.png';
import styles from './InlineIcon.module.css';

// Inline SVGs for React and HTML badges (kept small and self-contained)
const ReactSVG = ({ className }) => (
  <svg viewBox="0 0 841.9 595.3" className={className} aria-hidden focusable="false">
    <g fill="#61DAFB">
      <circle cx="420.9" cy="296.5" r="45.7" />
    </g>
  </svg>
);

const HTMLSVG = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className} aria-hidden focusable="false">
    <path fill="#E44D26" d="M71 460 30 0h452l-41 460-185 52" />
    <path fill="#F16529" d="M256 472l149-41 35-394H256" />
    <path fill="#EBEBEB" d="M256 208h-64l4 46h60v-46zM256 96h-136l9 102h127V96z" />
  </svg>
);

const ICON_MAP = {
  figma: { type: 'img', src: FigmaSrc, label: 'Figma' },
  vscode: { type: 'img', src: VScodeSrc, label: 'VS Code' },
  pencil: { type: 'img', src: Pencil, label: 'Pencil' },
  procreate: { type: 'img', src: ProcreateSrc, label: 'Procreate' },
  react: { type: 'img', src: ReactSrc, label: 'React' },
  'react js': { type: 'img', src: ReactSrc, label: 'React' },
  html: { type: 'img', src: HTMLSrc, label: 'HTML' },
  'ux/ui': { type: 'img', src: UXSrc, label: 'UX/UI' },
  cognitive: { type: 'img', src: CognitiveSrc, label: 'Cognitive' },
  linkedin: { type: 'img', src: LinkedinSrc, label: 'LinkedIn' },
  github: { type: 'img', src: GitHubSrc, label: 'GitHub' },
  bento: { type: 'img', src: BentoSrc, label: 'Bento' },
  artstation: { type: 'img', src: ArtstationSrc, label: 'ArtStation' },
  layers: { type: 'img', src: LayersSrc, label: 'Layers' },
  twitter: { type: 'img', src: TwitterSrc, label: 'Twitter' },
  apple: { type: 'img', src: AppleSrc, label: 'Apple' },
  draw: { type: 'img', src: DrawSrc, label: 'Drawing' },
  bordeaux: { type: 'img', src: FlagSrc, label: 'Bordeaux' },
  computer: { type: 'img', src: ComputerSrc, label: 'Computer Science' },
  css: { type: 'img', src: CSSSrc, label: 'CSS' },
  volley: { type: 'img', src: VolleySrc, label: 'Volleyball' },
};

const InlineIcon = ({ name, size = 'text', title }) => {
  if (!name) return null;
  const key = name.toString().trim().toLowerCase();
  const entry = ICON_MAP[key];
  const className = `${styles.inlineIcon} ${styles[size]}`.trim();

  if (!entry) return null;

  if (entry.type === 'img') {
    return <img src={entry.src} alt={entry.label} className={className} title={title || entry.label} loading="lazy" />;
  }

  const Svg = entry.svg;
  return <Svg className={className} title={title || entry.label} />;
};

InlineIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['text', 'title']),
  title: PropTypes.string,
};

export default InlineIcon;

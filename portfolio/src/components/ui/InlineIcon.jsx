import React from 'react';
import PropTypes from 'prop-types';
import figmaSrc from '@/assets/icons/figma-icone.png';
import uxSrc from '@/assets/icons/UX-design-icone.png';
import cognitiveSrc from '@/assets/icons/Cognitive-science-icone.png';
import reactSrc from '@/assets/icons/React-icone.png';
import htmlSrc from '@/assets/icons/HTML-icone.png';
import vscodeSrc from '@/assets/icons/VScode.png';
import linkedinSrc from '@/assets/icons/Linkedin.png';
import AppleSrc from '@/assets/icons/Apple-icone.png';
import DrawSrc from '@/assets/icons/Draw-icone.png';
import FlagSrc from '@/assets/icons/Bordeaux-icone.png';
import ComputerSrc from '@/assets/icons/Computer-icone.png';
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
  figma: { type: 'img', src: figmaSrc, label: 'Figma' },
  react: { type: 'img', src: reactSrc, label: 'React' },
  'react js': { type: 'img', src: reactSrc, label: 'React' },
  html: { type: 'img', src: htmlSrc, label: 'HTML' },
  'ux/ui': { type: 'img', src: uxSrc, label: 'UX/UI' },
  ux: { type: 'img', src: uxSrc, label: 'UX/UI' },
  cognitive: { type: 'img', src: cognitiveSrc, label: 'Cognitive' },
  vscode: { type: 'img', src: vscodeSrc, label: 'VS Code' },
  linkedin: { type: 'img', src: linkedinSrc, label: 'LinkedIn' },
  apple: { type: 'img', src: AppleSrc, label: 'Apple' },
  draw: { type: 'img', src: DrawSrc, label: 'Drawing' },
  bordeaux: { type: 'img', src: FlagSrc, label: 'Bordeaux' },
  computer: { type: 'img', src: ComputerSrc, label: 'Computer Science' },
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

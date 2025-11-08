import figmaIcon from '@/assets/icons/Figma.png';
import procreateIcon from '@/assets/icons/Procreate.png';
import vscodeIcon from '@/assets/icons/Visual Studio.png';
import paperIcon from '@/assets/icons/Paper.png';

const SUPPORT_ICON_MAP = {
  figma: { src: figmaIcon, label: 'Figma' },
  'figma ': { src: figmaIcon, label: 'Figma' },
  procreate: { src: procreateIcon, label: 'Procreate' },
  'pro create': { src: procreateIcon, label: 'Procreate' },
  vscode: { src: vscodeIcon, label: 'VS Code' },
  'vs code': { src: vscodeIcon, label: 'VS Code' },
  'visual studio code': { src: vscodeIcon, label: 'VS Code' },
  paper: { src: paperIcon, label: 'Paper' },
};

export const resolveSupportIcons = (supports = []) =>
  supports
    .map((support) => {
      const key = support?.toString().trim().toLowerCase();
      return SUPPORT_ICON_MAP[key] || null;
    })
    .filter(Boolean);

export default SUPPORT_ICON_MAP;

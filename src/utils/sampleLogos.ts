import { SampleLogoItem } from '../types';

/**
 * Creates SVG data URLs for high-fidelity representative test logos
 * corresponding directly to the Figma Integration Cards reference file
 */
export const SAMPLE_LOGOS: SampleLogoItem[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'Square Logo',
    description: 'Iconic cloud logo with transparent background',
    aspect: 'square',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M165 90C188.7 90 209.5 102.3 221.2 121C232.5 111.8 247 106.3 262.7 106.3C299 106.3 328.7 135.5 329.4 171.7C351.4 178.6 367 199.3 367 223.8C367 253.2 343.2 277 313.8 277H106.2C75.2 277 50 251.8 50 220.8C50 192.8 70.5 169.6 97.4 165.4C104.9 122.8 141.8 90 165 90Z" fill="#00A1E0"/>
      </svg>
    `)}`
  },
  {
    id: 'zapier',
    name: 'Zapier',
    type: 'Wide Logo',
    description: 'Wide horizontal text/mark (Figma ~112×30 aspect ratio)',
    aspect: 'wide',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="600" height="160" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Asterisk star mark -->
        <rect x="25" y="65" width="50" height="30" rx="6" fill="#FF4F00"/>
        <rect x="25" y="65" width="50" height="30" rx="6" transform="rotate(60 50 80)" fill="#FF4F00"/>
        <rect x="25" y="65" width="50" height="30" rx="6" transform="rotate(120 50 80)" fill="#FF4F00"/>
        <!-- Zapier text -->
        <text x="115" y="105" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" fill="#FFFFFF" letter-spacing="-2">zapier</text>
      </svg>
    `)}`
  },
  {
    id: 'wrike',
    name: 'Wrike',
    type: 'Wide Logo (112×70)',
    description: 'Wide integration mark (Figma ~112×70 aspect ratio)',
    aspect: 'wide',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="500" height="250" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Wrike signature geometric mark -->
        <path d="M50 60L100 190L140 100L180 190L230 60H185L160 135L135 60H105L80 135L55 60H50Z" fill="#04D066"/>
        <text x="250" y="160" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="90" fill="#FFFFFF">wrike</text>
      </svg>
    `)}`
  },
  {
    id: 'jira',
    name: 'Jira',
    type: 'Square Logo',
    description: 'Atlassian Jira geometric diamond logo',
    aspect: 'square',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M200 40C200 40 120 120 120 200C120 280 200 360 200 360C200 360 280 280 280 200C280 120 200 40 200 40Z" fill="#0052CC"/>
        <path d="M200 120C200 120 150 170 150 200C150 230 200 280 200 280C200 280 250 230 250 200C250 170 200 120 200 120Z" fill="#2684FF"/>
      </svg>
    `)}`
  },
  {
    id: 'chartmogul',
    name: 'ChartMogul',
    type: 'Padded Logo',
    description: 'Logo with large outer transparent padding',
    aspect: 'padded',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Centered small icon inside large 800x800 transparent canvas -->
        <g transform="translate(250, 250)">
          <rect x="20" y="80" width="50" height="180" rx="10" fill="#2A6DF4"/>
          <rect x="90" y="30" width="50" height="230" rx="10" fill="#1336B2"/>
          <rect x="160" y="120" width="50" height="140" rx="10" fill="#5F97FF"/>
          <rect x="230" y="0" width="50" height="260" rx="10" fill="#001880"/>
        </g>
      </svg>
    `)}`
  },
  {
    id: 'make',
    name: 'Make',
    type: 'Solid White BG',
    description: 'Logo with solid white background to test auto-removal',
    aspect: 'colored-bg',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Solid background box -->
        <rect width="400" height="400" fill="#FFFFFF"/>
        <!-- Make purple logo -->
        <rect x="80" y="80" width="240" height="240" rx="48" fill="#6F2CF5"/>
        <path d="M130 200L180 150V250L130 200Z" fill="#FFFFFF"/>
        <path d="M270 200L220 150V250L270 200Z" fill="#FFFFFF"/>
      </svg>
    `)}`
  },
  {
    id: 'zoho-crm',
    name: 'Zoho CRM',
    type: 'Square Logo',
    description: 'Four-color block icon with slight padding',
    aspect: 'square',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="70" width="115" height="115" rx="20" fill="#E42528"/>
        <rect x="215" y="70" width="115" height="115" rx="20" fill="#2EA147"/>
        <rect x="70" y="215" width="115" height="115" rx="20" fill="#1C6FB6"/>
        <rect x="215" y="215" width="115" height="115" rx="20" fill="#F49A24"/>
      </svg>
    `)}`
  }
];

/**
 * Helper to convert a data URL into a standard File object
 */
export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || 'image/svg+xml' });
}

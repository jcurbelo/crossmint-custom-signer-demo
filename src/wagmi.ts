import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseSepolia,
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_PROJECT_ID');
}

export const config = getDefaultConfig({
  appName: 'Crossmint Demo',
  projectId,
  chains: [
    baseSepolia,
  ],
  ssr: true,
});
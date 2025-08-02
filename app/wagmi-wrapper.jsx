'use client'

import { WagmiProvider } from 'wagmi'
import { config } from '../lib/wagmi'

export default function WagmiWrapper({ children }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

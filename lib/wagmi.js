import { createConfig, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains([mainnet], [publicProvider()])

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains,
})

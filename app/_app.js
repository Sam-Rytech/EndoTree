import '@/styles/globals.css'
import { WagmiProvider, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createConfig({
  autoConnect: true,
  publicClient: configureChains([sepolia], [publicProvider()]).publicClient,
})

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

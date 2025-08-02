import { WalletProvider } from '../context/WalletContext'
import './globals.css'

export const metadata = {
  title: 'OnchainLinktree',
  description: 'Decentralized link sharing on Base Sepolia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}

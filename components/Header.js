import { useWallet } from '../context/WalletContext'

export default function Header() {
  const { isConnected, address, isLoading, connect, formatAddress } =
    useWallet()

  return (
    <header className="gradient-bg shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔗</div>
            <h1 className="text-2xl font-bold text-white">OnchainLinktree</h1>
            <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-sm">
              Base Sepolia
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isLoading}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="text-white">
                <div className="text-sm opacity-90">Connected:</div>
                <div className="font-mono text-sm">
                  {formatAddress(address)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

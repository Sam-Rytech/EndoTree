import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWallet } from '../context/WalletContext'

export default function SearchProfile() {
  const [searchAddress, setSearchAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { isValidAddress } = useWallet()
  const router = useRouter()

  const handleSearch = async (e) => {
    e.preventDefault()

    const address = searchAddress.trim()

    if (!address) {
      alert('Please enter a wallet address')
      return
    }

    if (!isValidAddress(address)) {
      alert('Please enter a valid Ethereum address')
      return
    }

    setIsSearching(true)

    // Navigate to profile page
    await router.push(`/profile/${address}`)

    setIsSearching(false)
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🔍 View Someone's Profile
      </h3>
      <form onSubmit={handleSearch} className="flex space-x-3">
        <input
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Enter wallet address (0x...)"
          className="input-field flex-1"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="btn-primary flex-shrink-0"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="mt-3 text-sm text-gray-600">
        Enter a wallet address to view their on-chain links
      </div>
    </div>
  )
}

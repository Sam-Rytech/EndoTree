import { useState } from 'react'
import { useWallet } from '../context/WalletContext'

export default function ShareProfile() {
  const { address } = useWallet()
  const [copied, setCopied] = useState(false)

  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/profile/${address}`
      : ''

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = profileUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!address) return null

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📤 Share Your Profile
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Your profile URL:</p>
        <div className="flex items-center space-x-2">
          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm break-all">
            {profileUrl}
          </code>
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded transition-colors text-sm flex-shrink-0 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Share this URL with others to show your on-chain links
      </div>
    </div>
  )
}

import { useWallet } from '../context/WalletContext'

export default function PublicProfile({ address, links }) {
  const { formatAddress } = useWallet()

  // Generate avatar initials from address
  const getAvatarInitials = (addr) => {
    return addr ? addr.slice(2, 4).toUpperCase() : '??'
  }

  // Generate avatar color from address
  const getAvatarColor = (addr) => {
    if (!addr) return 'bg-gray-500'
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
    ]
    const index = parseInt(addr.slice(-1), 16) % colors.length
    return colors[index]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        {/* Profile Header */}
        <div className="mb-8">
          <div
            className={`w-24 h-24 ${getAvatarColor(
              address
            )} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}
          >
            {getAvatarInitials(address)}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {formatAddress(address)}
          </h2>
          <p className="text-gray-600">
            On-chain profile • {links?.length || 0} links
          </p>
        </div>

        {/* Links */}
        {links && links.length > 0 ? (
          <div className="space-y-4 mb-8">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors link-card font-medium"
              >
                <div className="flex items-center justify-between">
                  <span>{link.title}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-gray-600">No links found for this profile.</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-primary"
          >
            Create Your Own Profile
          </button>
        </div>
      </div>
    </div>
  )
}

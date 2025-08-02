export default function LoadingModal({
  isOpen,
  title = 'Processing Transaction',
  message = 'Please confirm in your wallet and wait for confirmation...',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4 animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}

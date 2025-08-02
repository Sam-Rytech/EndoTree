export default function LinkDisplay({ links, onEdit, showEditButton = false }) {
  if (!links || links.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">No links found for this profile.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800">
          {showEditButton ? 'Your Current Links' : 'Links'} ({links.length})
        </h4>
        {showEditButton && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ✏️ Edit Links
          </button>
        )}
      </div>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg flex items-center justify-between link-card"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-800">{link.title}</div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {link.url}
              </a>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors ml-4 flex-shrink-0"
            >
              Visit →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { validateLinks, sanitizeLinks } from '../lib/validation'

export default function LinkForm({ onSave, onClear, initialLinks = [] }) {
  const [links, setLinks] = useState(
    initialLinks.length > 0 ? initialLinks : [{ title: '', url: '' }]
  )
  const [errors, setErrors] = useState([])

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }])
  }

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks.length > 0 ? newLinks : [{ title: '', url: '' }])
  }

  const updateLink = (index, field, value) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleSave = () => {
    const sanitizedLinks = sanitizeLinks(links)
    const validationErrors = validateLinks(sanitizedLinks)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    onSave(sanitizedLinks)
  }

  const handleClear = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all your links? This cannot be undone.'
      )
    ) {
      onClear()
    }
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Your Links
      </h3>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-medium mb-2">
            Please fix the following errors:
          </h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Link Inputs */}
      <div className="space-y-4 mb-6">
        {links.map((link, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Link {index + 1}
              </span>
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Link Title (e.g., GitHub)"
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
                className="input-field"
                maxLength={100}
              />
              <input
                type="url"
                placeholder="https://github.com/yourusername"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                className="input-field"
                maxLength={500}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addLink}
          className="btn-secondary"
          disabled={links.length >= 50}
        >
          + Add Another Link
        </button>

        <button type="button" onClick={handleSave} className="btn-primary">
          💾 Save to Blockchain
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Link Count Info */}
      <div className="mt-4 text-sm text-gray-600">
        {links.length}/50 links • Title max 100 chars • URL max 500 chars
      </div>
    </div>
  )
}

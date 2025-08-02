import { VALIDATION_RULES } from './contract'

// URL validation
export function isValidURL(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Validate a single link
export function validateLink(link, index = 0) {
  const errors = []
  const position = index > 0 ? ` ${index + 1}` : ''

  // Title validation
  if (!link.title || link.title.trim().length === 0) {
    errors.push(`Link${position}: Title is required`)
  } else if (link.title.length > VALIDATION_RULES.MAX_TITLE_LENGTH) {
    errors.push(
      `Link${position}: Title too long (max ${VALIDATION_RULES.MAX_TITLE_LENGTH} characters)`
    )
  }

  // URL validation
  if (!link.url || link.url.trim().length === 0) {
    errors.push(`Link${position}: URL is required`)
  } else {
    if (link.url.length < VALIDATION_RULES.MIN_URL_LENGTH) {
      errors.push(
        `Link${position}: URL too short (min ${VALIDATION_RULES.MIN_URL_LENGTH} characters)`
      )
    }

    if (link.url.length > VALIDATION_RULES.MAX_URL_LENGTH) {
      errors.push(
        `Link${position}: URL too long (max ${VALIDATION_RULES.MAX_URL_LENGTH} characters)`
      )
    }

    if (!isValidURL(link.url)) {
      errors.push(
        `Link${position}: Invalid URL format (must start with http:// or https://)`
      )
    }
  }

  return errors
}

// Validate array of links
export function validateLinks(links) {
  const errors = []

  if (!Array.isArray(links)) {
    errors.push('Links must be an array')
    return errors
  }

  if (links.length === 0) {
    errors.push('Please add at least one link')
    return errors
  }

  if (links.length > VALIDATION_RULES.MAX_LINKS) {
    errors.push(`Maximum ${VALIDATION_RULES.MAX_LINKS} links allowed`)
  }

  // Validate each link
  links.forEach((link, index) => {
    const linkErrors = validateLink(link, index)
    errors.push(...linkErrors)
  })

  // Check for duplicate URLs
  const urls = links.map((link) => link.url?.toLowerCase()).filter(Boolean)
  const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index)

  if (duplicateUrls.length > 0) {
    errors.push('Duplicate URLs are not allowed')
  }

  return errors
}

// Sanitize link data
export function sanitizeLink(link) {
  return {
    title: link.title?.trim() || '',
    url: link.url?.trim() || '',
  }
}

// Sanitize array of links
export function sanitizeLinks(links) {
  if (!Array.isArray(links)) return []

  return links.map(sanitizeLink).filter((link) => link.title && link.url)
}

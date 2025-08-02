'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../../components/Header'
import PublicProfile from '../../../components/PublicProfile'
import { useWallet } from '../../../context/WalletContext'

export default function ProfilePage() {
  const params = useParams()
  const address = params.address
  const { getReadOnlyContract, isValidAddress } = useWallet()

  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (address) {
      loadProfile()
    }
  }, [address])

  const loadProfile = async () => {
    if (!isValidAddress(address)) {
      setError('Invalid wallet address')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contract = getReadOnlyContract()
      const hasLinks = await contract.hasLinks(address)

      if (!hasLinks) {
        setError('No profile found for this address')
        setIsLoading(false)
        return
      }

      const links = await contract.getLinks(address)

      setProfileData({
        address,
        links: links || [],
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
      setError('Failed to load profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    loadProfile()
  }

  const handleGoHome = () => {
    // For App Router, use Next.js navigation
    window.location.href = '/'
  }

  // Generate page title for document head (handled differently in App Router)
  const pageTitle = profileData
    ? `${profileData.address.slice(0, 8)}...${profileData.address.slice(
        -6
      )} - OnchainLinktree`
    : 'Profile - OnchainLinktree'

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="card max-w-md mx-auto">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Profile Not Found
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>

              <div className="space-y-3">
                <button onClick={handleRetry} className="btn-secondary w-full">
                  Try Again
                </button>
                <button onClick={handleGoHome} className="btn-primary w-full">
                  Create Your Own Profile
                </button>
              </div>
            </div>
          </div>
        ) : profileData ? (
          <div className="animate-fade-in">
            <PublicProfile
              address={profileData.address}
              links={profileData.links}
            />
          </div>
        ) : null}
      </main>
    </>
  )
}

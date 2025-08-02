"use client"

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import LinkForm from '../components/LinkForm'
import LinkDisplay from '../components/LinkDisplay'
import ShareProfile from '../components/ShareProfile'
import SearchProfile from '../components/SearchProfile'
import LoadingModal from '../components/LoadingModal'
import { useWallet } from '../context/WalletContext'

export default function Home() {
  const { isConnected, address, contract, parseContractError } = useWallet()
  const [userLinks, setUserLinks] = useState([])
  const [hasLinks, setHasLinks] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // Load user's links when connected
  useEffect(() => {
    if (isConnected && contract && address) {
      loadUserLinks()
    }
  }, [isConnected, contract, address])

  // Load user's existing links
  const loadUserLinks = async () => {
    try {
      const hasLinksResult = await contract.hasLinks(address)
      setHasLinks(hasLinksResult)

      if (hasLinksResult) {
        const links = await contract.getLinks(address)
        setUserLinks(links)
        setShowEditForm(false)
      } else {
        setUserLinks([])
        setShowEditForm(true)
      }
    } catch (error) {
      console.error('Failed to load links:', error)
    }
  }

  // Save links to blockchain
  const handleSaveLinks = async (links) => {
    setIsLoading(true)
    setLoadingMessage('Saving links to blockchain...')

    try {
      const tx = await contract.saveLinks(links)

      setLoadingMessage('Transaction submitted. Waiting for confirmation...')
      await tx.wait()

      setIsLoading(false)
      alert(`Successfully saved ${links.length} links to blockchain!`)
      await loadUserLinks()
    } catch (error) {
      setIsLoading(false)
      console.error('Save failed:', error)
      const errorMessage = parseContractError(error)
      alert(errorMessage)
    }
  }

  // Clear all links
  const handleClearLinks = async () => {
    setIsLoading(true)
    setLoadingMessage('Clearing all links...')

    try {
      const tx = await contract.clearLinks()

      setLoadingMessage('Transaction submitted. Waiting for confirmation...')
      await tx.wait()

      setIsLoading(false)
      alert('All links cleared successfully!')
      await loadUserLinks()
    } catch (error) {
      setIsLoading(false)
      console.error('Clear failed:', error)
      const errorMessage = parseContractError(error)
      alert(errorMessage)
    }
  }

  return (
    <>
      <Head>
        <title>OnchainLinktree - Decentralized Link Sharing on Base</title>
        <meta
          name="description"
          content="Create your decentralized link collection on Base Sepolia blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!isConnected ? (
          // Welcome Section
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Your Links, On-Chain Forever
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Store your links on Base Sepolia blockchain
            </p>

            <div className="card max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div
                  className="animate-slide-up"
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className="text-3xl mb-2">🔐</div>
                  <p className="font-medium">Connect Wallet</p>
                  <p className="text-sm text-gray-600">MetaMask required</p>
                </div>
                <div
                  className="animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="text-3xl mb-2">📝</div>
                  <p className="font-medium">Add Your Links</p>
                  <p className="text-sm text-gray-600">GitHub, Twitter, etc.</p>
                </div>
                <div
                  className="animate-slide-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="text-3xl mb-2">🌐</div>
                  <p className="font-medium">Share Profile</p>
                  <p className="text-sm text-gray-600">
                    Permanent & decentralized
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Connected User Interface
          <div className="space-y-8 animate-fade-in">
            {showEditForm || !hasLinks ? (
              // Show form for adding/editing links
              <LinkForm
                onSave={handleSaveLinks}
                onClear={handleClearLinks}
                initialLinks={userLinks}
              />
            ) : (
              // Show current links
              <LinkDisplay
                links={userLinks}
                onEdit={() => setShowEditForm(true)}
                showEditButton={true}
              />
            )}

            {/* Share Profile Section */}
            {hasLinks && <ShareProfile />}
          </div>
        )}

        {/* Search Section - Always visible */}
        <div className="mt-12">
          <SearchProfile />
        </div>
      </main>

      {/* Loading Modal */}
      <LoadingModal isOpen={isLoading} message={loadingMessage} />
    </>
  )
}

import { ethers } from 'ethers'
import { NETWORK_CONFIG } from './contract'

export class WalletService {
  constructor() {
    this.provider = null
    this.signer = null
    this.address = null
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return (
      typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    )
  }

  // Connect to MetaMask
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Switch to Base Sepolia if needed
      await this.switchToBaseSepolia()

      // Setup provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.address = accounts[0]

      return this.address
    } catch (error) {
      console.error('Connection failed:', error)
      throw error
    }
  }

  // Switch to Base Sepolia network
  async switchToBaseSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainIdHex }],
      })
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: NETWORK_CONFIG.chainIdHex,
              chainName: NETWORK_CONFIG.name,
              nativeCurrency: NETWORK_CONFIG.nativeCurrency,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  // Check if already connected
  async checkConnection() {
    if (!this.isMetaMaskInstalled()) {
      return null
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        this.provider = new ethers.BrowserProvider(window.ethereum)
        this.signer = await this.provider.getSigner()
        this.address = accounts[0]
        return this.address
      }

      return null
    } catch (error) {
      console.error('Check connection failed:', error)
      return null
    }
  }

  // Get read-only provider for viewing profiles
  getReadOnlyProvider() {
    return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Validate Ethereum address
  isValidAddress(address) {
    return ethers.isAddress(address)
  }

  // Parse contract errors
  parseContractError(error) {
    const errorMessage = error.message || error.toString()

    if (errorMessage.includes('EmptyTitle')) {
      return 'Title cannot be empty or too long (max 100 characters)'
    }
    if (errorMessage.includes('EmptyURL')) {
      return 'URL cannot be empty'
    }
    if (errorMessage.includes('InvalidURL')) {
      return 'URL must start with http:// or https:// and be properly formatted'
    }
    if (errorMessage.includes('TooManyLinks')) {
      return 'Maximum 50 links allowed per user'
    }
    if (errorMessage.includes('NoLinksToDelete')) {
      return 'No links found to delete'
    }
    if (errorMessage.includes('UnauthorizedAccess')) {
      return 'You can only modify your own links'
    }
    if (errorMessage.includes('user rejected')) {
      return 'Transaction was rejected by user'
    }
    if (errorMessage.includes('insufficient funds')) {
      return 'Insufficient funds for gas fees'
    }

    return 'Transaction failed. Please try again.'
  }
}

export const walletService = new WalletService()

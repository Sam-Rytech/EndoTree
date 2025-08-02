import { createContext, useContext, useReducer, useEffect } from 'react'
import { ethers } from 'ethers'
import { walletService } from '../lib/wallet'
import { CONTRACT_CONFIG } from '../lib/contract'

// Initial state
const initialState = {
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  contract: null,
  isLoading: false,
  error: null,
}

// Action types
const WALLET_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CONNECTED: 'SET_CONNECTED',
  SET_DISCONNECTED: 'SET_DISCONNECTED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer
function walletReducer(state, action) {
  switch (action.type) {
    case WALLET_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null }

    case WALLET_ACTIONS.SET_CONNECTED:
      return {
        ...state,
        isConnected: true,
        address: action.payload.address,
        provider: action.payload.provider,
        signer: action.payload.signer,
        contract: action.payload.contract,
        isLoading: false,
        error: null,
      }

    case WALLET_ACTIONS.SET_DISCONNECTED:
      return {
        ...initialState,
        isLoading: false,
      }

    case WALLET_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }

    case WALLET_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}

// Create context
const WalletContext = createContext()

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Wallet provider component
export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  // Connect wallet
  const connect = async () => {
    dispatch({ type: WALLET_ACTIONS.SET_LOADING, payload: true })

    try {
      const address = await walletService.connect()
      const provider = walletService.provider
      const signer = walletService.signer
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      )

      dispatch({
        type: WALLET_ACTIONS.SET_CONNECTED,
        payload: { address, provider, signer, contract },
      })
    } catch (error) {
      console.error('Connection failed:', error)
      dispatch({
        type: WALLET_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to connect wallet',
      })
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    dispatch({ type: WALLET_ACTIONS.SET_DISCONNECTED })
  }

  // Get read-only contract for viewing profiles
  const getReadOnlyContract = () => {
    const provider = walletService.getReadOnlyProvider()
    return new ethers.Contract(
      CONTRACT_CONFIG.address,
      CONTRACT_CONFIG.abi,
      provider
    )
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: WALLET_ACTIONS.CLEAR_ERROR })
  }

  // Check existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      dispatch({ type: WALLET_ACTIONS.SET_LOADING, payload: true })

      try {
        const address = await walletService.checkConnection()

        if (address) {
          const provider = walletService.provider
          const signer = walletService.signer
          const contract = new ethers.Contract(
            CONTRACT_CONFIG.address,
            CONTRACT_CONFIG.abi,
            signer
          )

          dispatch({
            type: WALLET_ACTIONS.SET_CONNECTED,
            payload: { address, provider, signer, contract },
          })
        } else {
          dispatch({ type: WALLET_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('Check connection failed:', error)
        dispatch({ type: WALLET_ACTIONS.SET_LOADING, payload: false })
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== state.address) {
          // Account changed, reconnect
          connect()
        }
      }

      const handleChainChanged = () => {
        // Reload page on chain change
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            'accountsChanged',
            handleAccountsChanged
          )
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [state.address])

  const value = {
    ...state,
    connect,
    disconnect,
    getReadOnlyContract,
    clearError,
    formatAddress: walletService.formatAddress,
    isValidAddress: walletService.isValidAddress,
    parseContractError: walletService.parseContractError,
  }

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

# OnchainLinktree - Decentralized Link Sharing

A decentralized version of Linktree built on Base Sepolia blockchain using Next.js and Solidity.

## 🌟 Features

- **Wallet Integration**: Connect with MetaMask
- **On-Chain Storage**: Links stored permanently on Base Sepolia
- **Profile Sharing**: Shareable URLs for public profiles
- **Input Validation**: Client-side and smart contract validation
- **Responsive Design**: Works on desktop and mobile
- **Gas Optimized**: Efficient smart contract design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Base Sepolia ETH (from faucet)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd onchain-linktree
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local and add your deployed contract address
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📋 Deployment Steps

### 1. Deploy Smart Contract

1. Deploy `LinkRegistry.sol` to Base Sepolia
2. Verify the contract on BaseScan
3. Copy the contract address

### 2. Configure Frontend

1. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
2. Test the connection locally

### 3. Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## 🔧 Project Structure

```
onchain-linktree/
├── components/           # React components
│   ├── Header.js        # Navigation header
│   ├── LinkForm.js      # Link management form
│   ├── LinkDisplay.js   # Display user links
│   ├── PublicProfile.js # Public profile view
│   ├── SearchProfile.js # Profile search
│   ├── ShareProfile.js  # Profile sharing
│   └── LoadingModal.js  # Loading modal
├── context/
│   └── WalletContext.js # Wallet state management
├── lib/
│   ├── contract.js      # Contract configuration
│   ├── wallet.js        # Wallet utilities
│   └── validation.js    # Input validation
├── pages/
│   ├── index.js         # Home page
│   ├── profile/
│   │   └── [address].js # Dynamic profile pages
│   └── _app.js          # App wrapper
├── styles/
│   └── globals.css      # Global styles
└── contracts/
    └── LinkRegistry.sol # Smart contract
```

## 🛠️ Smart Contract

### LinkRegistry.sol Features

- **Access Control**: Users can only modify their own links
- **Input Validation**: URL format and length validation
- **Gas Efficient**: Optimized storage and operations
- **Error Handling**: Custom errors for better UX

### Key Functions

```solidity
function saveLinks(Link[] memory _links) external
function getLinks(address _user) external view returns (Link[] memory)
function addLink(string memory _title, string memory _url) external
function clearLinks() external
function hasLinks(address _user) external view returns (bool)
```

## 🔐 Security Features

1. **Access Control**: Users can only modify their own data
2. **Input Validation**: Both client-side and contract validation
3. **URL Validation**: Ensures proper HTTP/HTTPS format
4. **Length Limits**: Title (100 chars), URL (500 chars)
5. **Rate Limiting**: Max 50 links per user

## 🌐 Network Configuration

- **Blockchain**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## 📱 User Flow

1. **Connect Wallet** → MetaMask connection with Base Sepolia
2. **Add Links** → Form validation and submission
3. **Save to Blockchain** → Transaction confirmation
4. **Share Profile** → Generated public URL
5. **View Others** → Search by wallet address

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Design**: Modern, clean interface
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and loading states

## 🔄 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] Network switching to Base Sepolia
- [ ] Link form validation (client-side)
- [ ] Smart contract validation (on-chain)
- [ ] Save links transaction
- [ ] Clear links transaction
- [ ] Profile sharing URL generation
- [ ] Public profile viewing
- [ ] Search functionality
- [ ] Mobile responsiveness

### Test Cases

1. **Valid Links**: Save multiple valid links
2. **Invalid URLs**: Test malformed URLs
3. **Empty Fields**: Test empty title/URL validation
4. **Length Limits**: Test max character limits
5. **Duplicate URLs**: Test duplicate detection
6. **Max Links**: Test 50 link limit
7. **Profile Search**: Test valid/invalid addresses

## 🚨 Error Handling

### Client-Side Errors
- Invalid URL format
- Empty required fields
- Character length limits
- Invalid Ethereum addresses

### Contract Errors
- `EmptyTitle`: Title validation failed
- `EmptyURL`: URL validation failed
- `InvalidURL`: URL format validation failed
- `TooManyLinks`: Exceeded 50 link limit
- `UnauthorizedAccess`: User tried to modify others' links
- `NoLinksToDelete`: No links to clear

### Network Errors
- MetaMask not installed
- Wrong network selected
- Transaction rejected
- Insufficient gas fees

## 📈 Gas Optimization

The smart contract is optimized for gas efficiency:

1. **Batch Operations**: Save all links in one transaction
2. **Custom Errors**: More efficient than require strings
3. **Minimal Storage**: Simple struct design
4. **Efficient Deletion**: Array swap-and-pop for removals

## 🔒 Security Considerations

1. **Input Sanitization**: All inputs are validated
2. **Access Control**: Proper ownership checks
3. **Reentrancy Protection**: No external calls in state changes
4. **Integer Overflow**: Using Solidity 0.8+ built-in protection
5. **Front-end Validation**: Double validation (client + contract)

## 🌍 Production Deployment

### Environment Setup

1. **Contract Deployment**
   ```bash
   # Deploy to Base Sepolia
   # Verify on BaseScan
   # Update CONTRACT_ADDRESS
   ```

2. **Frontend Deployment**
   ```bash
   # Build application
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   ```

### Post-Deployment Checklist

- [ ] Contract verified on BaseScan
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] Wallet connection works
- [ ] Transaction flow tested
- [ ] Public profiles accessible
- [ ] Mobile experience tested

## 📚 Additional Resources

- [Base Documentation](https://docs.base.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🛟 Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure MetaMask is connected to Base Sepolia
3. Verify you have sufficient ETH for gas fees
4. Check that the contract address is correct
5. Try refreshing the page

## 🎯 Future Enhancements

- [ ] ENS name resolution
- [ ] Custom themes/styling
- [ ] Link analytics
- [ ] Social media previews
- [ ] Bulk import/export
- [ ] Link categories/tags
- [ ] QR code generation
- [ ] Custom domain support
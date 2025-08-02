export const CONTRACT_CONFIG = {
  address:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x57ae67e75d4973757090aa3931f3208a2cfc0673',
  abi: [
    'struct Link { string title; string url; }',
    'function saveLinks(tuple(string,string)[] memory _links) external',
    'function getLinks(address _user) external view returns (tuple(string,string)[] memory)',
    'function getLinkCount(address _user) external view returns (uint256)',
    'function addLink(string memory _title, string memory _url) external',
    'function removeLink(uint256 _index) external',
    'function updateLink(uint256 _index, string memory _title, string memory _url) external',
    'function clearLinks() external',
    'function hasLinks(address _user) external view returns (bool)',
    'function getLink(address _user, uint256 _index) external view returns (tuple(string,string) memory)',
    'function getContractInfo() external pure returns (uint256, uint256, uint256)',
    'error EmptyTitle()',
    'error EmptyURL()',
    'error InvalidURL()',
    'error TooManyLinks()',
    'error NoLinksToDelete()',
    'error UnauthorizedAccess()',
  ],
}

export const NETWORK_CONFIG = {
  chainId: 84532,
  chainIdHex: '0x14a34',
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const VALIDATION_RULES = {
  MAX_LINKS: 50,
  MAX_TITLE_LENGTH: 100,
  MAX_URL_LENGTH: 500,
  MIN_URL_LENGTH: 10,
}

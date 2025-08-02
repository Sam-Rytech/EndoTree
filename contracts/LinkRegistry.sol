// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LinkRegistry {
    struct Link {
        string title;
        string url;
    }

    mapping(address => Link[]) private userLinks;

    event LinksUpdated(address indexed user, uint256 linkCount);
    event LinksCleared(address indexed user);
    event LinkAdded(address indexed user, string title, string url);

    error EmptyTitle();
    error EmptyURL();
    error InvalidURL();
    error TooManyLinks();
    error NoLinksToDelete();
    error UnauthorizedAccess();

    uint256 public constant MAX_LINKS_PER_USER = 50;
    uint256 public constant MAX_TITLE_LENGTH = 100;
    uint256 public constant MAX_URL_LENGTH = 500;

    modifier onlyOwner(address _user) {
        if (msg.sender != _user) revert UnauthorizedAccess();
        _;
    }

    function _isValidURL(string memory _url) private pure returns (bool) {
        bytes memory urlBytes = bytes(_url);

        if (urlBytes.length < 10 || urlBytes.length > MAX_URL_LENGTH) {
            return false;
        }

        bool startsWithHttp = true;
        bool startsWithHttps = true;

        bytes memory httpsPrefix = bytes("https://");
        if (urlBytes.length >= httpsPrefix.length) {
            for (uint i = 0; i < httpsPrefix.length; i++) {
                if (urlBytes[i] != httpsPrefix[i]) {
                    startsWithHttps = false;
                    break;
                }
            }
        } else {
            startsWithHttps = false;
        }

        if (!startsWithHttps) {
            bytes memory httpPrefix = bytes("http://");
            if (urlBytes.length >= httpPrefix.length) {
                for (uint i = 0; i < httpPrefix.length; i++) {
                    if (urlBytes[i] != httpPrefix[i]) {
                        startsWithHttp = false;
                        break;
                    }
                }
            } else {
                startsWithHttp = false;
            }
        }

        return startsWithHttps || startsWithHttp;
    }

    function _validateLink(string memory _title, string memory _url) private pure {
        if (bytes(_title).length == 0) revert EmptyTitle();
        if (bytes(_url).length == 0) revert EmptyURL();
        if (bytes(_title).length > MAX_TITLE_LENGTH) revert EmptyTitle();
        if (!_isValidURL(_url)) revert InvalidURL();
    }

    function saveLinks(Link[] memory _links) external {
        if (_links.length > MAX_LINKS_PER_USER) revert TooManyLinks();

        for (uint256 i = 0; i < _links.length; i++) {
            _validateLink(_links[i].title, _links[i].url);
        }

        delete userLinks[msg.sender];

        for (uint256 i = 0; i < _links.length; i++) {
            userLinks[msg.sender].push(_links[i]);
        }

        emit LinksUpdated(msg.sender, _links.length);
    }

    function getLinks(address _user) external view returns (Link[] memory) {
        return userLinks[_user];
    }

    function getLinkCount(address _user) external view returns (uint256) {
        return userLinks[_user].length;
    }

    function addLink(string memory _title, string memory _url) external {
        if (userLinks[msg.sender].length >= MAX_LINKS_PER_USER) revert TooManyLinks();

        _validateLink(_title, _url);

        userLinks[msg.sender].push(Link({
            title: _title,
            url: _url
        }));

        emit LinkAdded(msg.sender, _title, _url);
        emit LinksUpdated(msg.sender, userLinks[msg.sender].length);
    }

    function removeLink(uint256 _index) external {
        Link[] storage links = userLinks[msg.sender];
        if (_index >= links.length) revert NoLinksToDelete();

        links[_index] = links[links.length - 1];
        links.pop();

        emit LinksUpdated(msg.sender, links.length);
    }

    function updateLink(uint256 _index, string memory _title, string memory _url) external {
        Link[] storage links = userLinks[msg.sender];
        if (_index >= links.length) revert NoLinksToDelete();

        _validateLink(_title, _url);

        links[_index].title = _title;
        links[_index].url = _url;

        emit LinksUpdated(msg.sender, links.length);
    }

    function clearLinks() external {
        if (userLinks[msg.sender].length == 0) revert NoLinksToDelete();

        delete userLinks[msg.sender];
        emit LinksCleared(msg.sender);
    }

    function hasLinks(address _user) external view returns (bool) {
        return userLinks[_user].length > 0;
    }

    function getLink(address _user, uint256 _index) external view returns (Link memory) {
        require(_index < userLinks[_user].length, "Link index out of bounds");
        return userLinks[_user][_index];
    }

    function getContractInfo() external pure returns (uint256 maxLinks, uint256 maxTitleLength, uint256 maxUrlLength) {
        return (MAX_LINKS_PER_USER, MAX_TITLE_LENGTH, MAX_URL_LENGTH);
    }
}

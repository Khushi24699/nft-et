//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

 contract Token is ERC721{
     using Counters for Counters.Counter;
     using Strings for uint256;
     Counters.Counter public tokenIds;

     mapping(uint256 =>string) _tokenURIs;
     string private _baseURIs;

     
     constructor(string memory _name, string memory _symbol)   ERC721(_name, _symbol){
     }
     
     event NFTminted(address owner, uint256 id);
    
    
     //mint the collectibles
     function mintNft(address reciever, string memory _tokenURI ) external {
        uint256 id = tokenIds.current();
        _mint(reciever,id);
        _setTokenURI(id,_tokenURI);
        tokenIds.increment();
       emit  NFTminted(reciever,id);
         
     }
     
    //set the URI of collectibles
     function _setTokenURI(uint256 id,string memory _tokenURI)internal {
         require(_exists(id),"URI of nonexistent token");
         _tokenURIs[id] = _tokenURI;
     }

     //set baseURI of collectibles
    function _setbaseURI(string memory baseURIs) external {
        _baseURIs = baseURIs;
    }


    function tokenURI(uint256 id) public view virtual override returns(string memory){
        require(_exists(id),"URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[id];
        string memory base = _baseURI();
        //return token URI if baseURI is not present
        if(bytes(base).length==0){
            return(_tokenURI);
        }
        //concatenate both base and token URI if both are present
        if(bytes(_tokenURI).length>0){
            return string(abi.encodePacked(base,_tokenURI));
        }
    
        //concatenate baseURI with tokenId if tokenURI isnot present
        return string (abi.encodePacked(base,id.toString()));
        
    }


     //display the tokens belonging to the particular owner
     function tokensofOwner(address _owner) external view  returns(uint256[] memory){
         uint256 _total = tokenIds.current();
         uint256 numTokens = balanceOf(_owner);
         uint256[] memory owner_token  = new uint256[](numTokens);
         uint256 resultindex =0;
        for(uint256 i = 0; i<_total; i++){
            if(ownerOf(i) == _owner)
            {
                owner_token[resultindex]=i;
                resultindex ++;
            }
        }
        return owner_token; 
     }
     
 }
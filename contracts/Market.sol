//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;

import "./Token.sol";


contract Tokenmarket{
    
    address  payable seller;
    address  payable buyer;
    Token public tokens;
    
    // enum  states {
    //     initial,
    //     sale
    // }

     struct token{
        uint256 forsale;
        uint256 sellingprice;
    }
    // mapping(uint256 => states) public forsale;//maps the tokenid with it's state
    // mapping(uint256 =>bool) forsale;
    // mapping(uint256 => uint256) sellingprice; // maps the tokenid with it's selling price as added by the owner
    
    mapping(uint256=>token) collectibes;

    constructor ( Token _tokens)  {
         tokens = _tokens;
    }
     event listedforsale(uint256 tokenid, uint256 price , address issuer);
     event tokensold(uint256 id , address buyer );

     modifier paidenough(uint256 price){
        require(msg.value >= price,"Not sufficient price");
        
        _;
    }
    modifier refundexcess(uint256 price)   {
        if (msg.value > price)
        {
            uint256 return_value;
            return_value = msg.value -price;
            buyer = payable(msg.sender);
            buyer.transfer(return_value);
        }
        _;
    }

     //to list the collectibles for sale by the owner ,contract(approved to sale token on behalf of owner)
    function listforsell(uint256 price,uint256 tokenid) public{
        require(price != 0,"Selling price cannot be zero");
        require(collectibes[tokenid].forsale == 0 ,"Token already in sale");

        // require(forsale[tokenid] != states.sale,"Token already in sale");
        require (tokens.getApproved(tokenid) == address(this),"Contract is not approved to sell the token");
        // sellingprice[tokenid] = price;
        // forsale[tokenid] = states.sale;
        collectibes[tokenid].sellingprice = price;
        collectibes[tokenid].forsale =1;
        emit listedforsale(tokenid, price ,address(this));

    }
    //buy the collectibles paying sufficient price as indicated
    function buytoken(uint256 tokenid) public  payable  paidenough (collectibes[tokenid].sellingprice) refundexcess(collectibes[tokenid].sellingprice){
        
        // uint256 price = sellingprice[tokenid];
         uint256 price = collectibes[tokenid].sellingprice;

        // require(forsale[tokenid] == states.sale,"Token is not forsale");
        require(collectibes[tokenid].forsale == 1,"Token is not forsale");
        require(price > 0, "not for sale");
        
        seller = payable(tokens.ownerOf(tokenid));
        seller.transfer(price);
        collectibes[tokenid].forsale = 0;

       
        tokens.safeTransferFrom(seller,msg.sender,tokenid);
      emit   tokensold(tokenid, msg.sender);
       
    }
    
    //dispaly the details of the collectibles
    function tokendetails(uint256 id) public  view returns( address _owner, string  memory tokenuri,uint256 price){
        address owner = tokens.ownerOf(id);
        string memory uri = tokens.tokenURI(id);
        return(owner,uri,
        // collectibes[id].forsale,
        collectibes[id].sellingprice
        // forsale[id],
        // sellingprice[id]
        ); 
    }

    //display the token state
    function tokenstate(uint256 id) public view returns (uint256 forsale){
        return collectibes[id].forsale; 

    }
    //display tokenprice 
    function tokenprice(uint256 id) public view returns(uint256 price){
        return collectibes[id].sellingprice;
    }
    
    //remove the token form the sale list
    function cancelsell(uint256 tokenid) public {
        // require(forsale[tokenid] == states.sale,"Token isnot for sale");
        require(collectibes[tokenid].forsale == 1,"Token isnot for sale");

        require(msg.sender ==tokens.ownerOf(tokenid),"Only  Token owner can cancel the sell ");
        // forsale[tokenid] = states.initial;
     collectibes[tokenid].forsale = 0;


    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/Mintable.sol";
import "../contracts/BulkMint.sol";
import "contracts/utils/CollectionArray.sol";
import "contracts/BlackList.sol";

contract CollectionFactory is BlackList {

    using CollectionArray for CollectionArray.users;
    CollectionArray.users private _collections;

    uint256 brokrage;
    address public brokrageAddress;


    enum Role{
        Mintable,
        BulkMintNFT
    }

    event CollectionCreated(
        address indexed collectionAddress, 
        address indexed creater
    );
    
   
    function CreateCollection(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory  _baseURISuffixs,
        string memory _baseURIPrefix,
        uint96 _royality,
        Role _role
    ) public _isPermitted {
                
        if (_role== Role.Mintable){

        Mintable collection =  new Mintable(_name, _symbol, _maxSupply, _baseURIPrefix, _royality, msg.sender);
        _collections.add(address(collection));
        emit CollectionCreated(address(collection), msg.sender);
        }
        else{
            BulkMintNFT collection = new BulkMintNFT(_name, _symbol, _maxSupply,_baseURIPrefix, _baseURISuffixs, _royality,msg.sender);
        _collections.add(address(collection));
 emit CollectionCreated(address(collection), msg.sender);
        }
    
    }
}

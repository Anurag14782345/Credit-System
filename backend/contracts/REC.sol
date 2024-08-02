// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agung {
    string public name = "Renewable Energy Certificate";
    string public symbol = "REC";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // New struct to represent an offer
    struct Offer {
        address seller;
        uint256 amount;
        uint256 pricePerUnit;
        bool isAvailable;
    }

    // Array to store offers
    Offer[] public offers;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OfferCreated(uint256 indexed offerId, address indexed seller, uint256 amount, uint256 pricePerUnit);
    event OfferCancelled(uint256 indexed offerId, address indexed seller);
    event OfferAccepted(uint256 indexed offerId, address indexed buyer, address indexed seller, uint256 amount, uint256 pricePerUnit);

    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function exchange(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    // New function to list RECs for sale
    function listForSale(uint256 _amount, uint256 _pricePerUnit) public returns (uint256 offerId) {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance to list for sale");
        offers.push(Offer({
            seller: msg.sender,
            amount: _amount,
            pricePerUnit: _pricePerUnit,
            isAvailable: true
        }));
        offerId = offers.length - 1;
        emit OfferCreated(offerId, msg.sender, _amount, _pricePerUnit);
    }

    // New function to cancel a listed offer
    function cancelOffer(uint256 _offerId) public {
        Offer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Only the seller can cancel the offer");
        offer.isAvailable = false;
        emit OfferCancelled(_offerId, msg.sender);
    }

    // New function to buy RECs
    function buyREC(uint256 _offerId, uint256 _amount) public payable {
        Offer storage offer = offers[_offerId];
        require(offer.isAvailable, "Offer is not available");
        require(_amount <= offer.amount, "Not enough units available");
        require(msg.value == _amount * offer.pricePerUnit, "Incorrect payment amount");

        balanceOf[offer.seller] -= _amount;
        balanceOf[msg.sender] += _amount;
        offer.amount -= _amount;

        if (offer.amount == 0) {
            offer.isAvailable = false;
        }

        payable(offer.seller).transfer(msg.value);
        emit OfferAccepted(_offerId, msg.sender, offer.seller, _amount, offer.pricePerUnit);
    }

    // New function to get the count of offers
    function getOffersCount() public view returns (uint256) {
        return offers.length;
    }

    // New function to get an offer by its ID
    function getOffer(uint256 _offerId) public view returns (address seller, uint256 amount, uint256 pricePerUnit, bool isAvailable) {
        Offer storage offer = offers[_offerId];
        return (offer.seller, offer.amount, offer.pricePerUnit, offer.isAvailable);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract StakeContract is IERC20, Ownable {
    mapping(address => uint) public override balanceOf;
    mapping(address => uint) public stakeBalance;
    mapping(address => uint) userStakeTime;
    mapping(address => mapping(address => uint)) public override allowance;
    uint public override totalSupply;
    uint pricePerToken = 1000000000000;
    address sc_owner;
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    event TokenStateAlert(address indexed _from, uint _value, string _message);

    constructor(string memory _name, string memory _symbol) {
        sc_owner = owner();
        name = _name;
        symbol = _symbol;
        balanceOf[sc_owner] += 1000;
        totalSupply += 1000;
    }

    modifier OnlyOwner() {
        require(msg.sender == sc_owner, "Not Owner");
        _;
    }

    modifier CheckStakeAge(uint stakeTime) {
        require(block.timestamp >= stakeTime + 604800, "Your stake age is either less than one week or reward has been claimed");
        _;
    }


    function modifyBuyTokenPrice(uint _amount) public OnlyOwner {
        pricePerToken = _amount;
    }

    function buyToken() external payable {
        uint amountOfToken = msg.value / pricePerToken;
        userStakeTime[msg.sender] = block.timestamp;
        _mint(amountOfToken, msg.sender);
    }

    function stakeToken(uint amountOfToken) external {
        require(balanceOf[msg.sender] >= amountOfToken, "Not enough token");
        balanceOf[msg.sender] -= amountOfToken;
        stakeBalance[msg.sender] += amountOfToken;
        userStakeTime[msg.sender] = block.timestamp;
        emit TokenStateAlert(msg.sender, amountOfToken, "Token Staked");
    }


    function claimReward() external CheckStakeAge(userStakeTime[msg.sender]) returns (bool) {
        uint reward = 1 * stakeBalance[msg.sender] / 100;
        balanceOf[msg.sender] += reward;
        userStakeTime[msg.sender] = block.timestamp;
        emit Transfer(address(0), msg.sender, reward);
        return true;
    }

    function unstakeToken(uint amountOfToken) external returns (bool){
        require(stakeBalance[msg.sender] >= amountOfToken, "Amount exceeds current stake");
        stakeBalance[msg.sender] -= amountOfToken;
        balanceOf[msg.sender] += amountOfToken;
        return true;
    }

    function getStakeBalance() external view returns (uint) {
        return stakeBalance[msg.sender];
    }

    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

    function getUserNumOfToken() public view returns (uint) {
        return balanceOf[msg.sender];
    }

    function _mint(uint amountOfToken, address receiver) private {
        balanceOf[receiver] += amountOfToken;
        totalSupply += amountOfToken;
        emit Transfer(address(0), receiver, amountOfToken);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }


    function transfer(address recipient, uint amount) external override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

}


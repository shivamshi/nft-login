const { validateNoLeadingZeroes } = require("ethereumjs-util");
const express = require("express");
const app = express();
const Web3 = require("web3");
const address = "0x0b85f70318486145c5C84A5deb040D6Ce38f0Cf2"
const url = "https://polygon-mumbai.g.alchemy.com/v2/HXppMyS9DXP6baHkWcIZ5vs3B9FaMpbv"
const privateKey = "2ed8beadae27b7ec97c19caddacbbbcf79e45a788cbd759a69c9164ffaca6311"
const contractAddress = "0xA7505Ecc5e663960Ab5CA850F52F6f038F42E018"
const ABI = require("./abi"); 
const PORT = process.env.PORT || 5000

const web3 = new Web3(url);

//console.log(networkId);
const myContract = new web3.eth.Contract(
    ABI,
    contractAddress
);
const init1 = async(req,res) =>{
     
    const {account, amount} = req.body;
    const networkId = await web3.eth.net.getId();    
     const tx = myContract.methods.transferFiatToCrypto("NoName","0xA96135B3EA9a9ec72e62D1f05666E839646fEE93",10);
    console.log(tx)
    const gas = await tx.estimateGas({from: address});
    console.log(gas)
    const gasPrice = (await web3.eth.getGasPrice())*10;
    console.log(gasPrice)
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(address);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: myContract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId
    },
    privateKey
    );
    console.log(`ld data value:${await myContract.methods.balanceOf("0xA96135B3EA9a9ec72e62D1f05666E839646fEE93").call()}`);
     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    //  console.log(receipt)
    console.log(`Transaction hash : ${receipt.transactionHash}`);
    console.log(`ld data value:${await myContract.methods.balanceOf("0xA96135B3EA9a9ec72e62D1f05666E839646fEE93").call()}`);
    res.status(200).send({success: true})
}
//init1();
const getValue = async(req,res) =>{
   const { account } = req.body;
   const Value = await myContract.methods.balanceOf(account).call()
   res.send(Value);
}
const payment = async(req,res)=>{
    console.log(req);
    res.status(200).send({success});
}
app.get("/",init1);
app.get("/accountToken",getValue);
app.get("/payment",payment);

app.listen(PORT,()=>{
	console.log(`PORT RUNNING AT ${PORT}`);
})
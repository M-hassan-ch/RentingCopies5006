const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Renting5006 Tokens", function () {

  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const currentSigner = (await ethers.getSigner());
    const raw = await ethers.getContractFactory("SampleERC5006");
    const contract = await raw.deploy();

    await contract.deployed();

    // console.log(
    //   `Contract deployed at ${contract.address}`
    //   );

    return [currentSigner, contract];

  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      expect(currentSigner.address).to.equal(await contract.owner());
    });
  });

  describe("Minting", function () {

    let beforeTokenID;
    const uri = '123';
    const copies = 5;

    it("Should increment token Id", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      beforeTokenID = Number(await contract._tokenId());

      await contract.connect(currentSigner).mintToken(uri, copies);
      const currentTokenID = Number(await contract._tokenId());

      expect(beforeTokenID + 1).to.equal(currentTokenID);
    });

    it("Should set correct token URI and token copies", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      await contract.connect(currentSigner).mintToken(uri, copies);
      const _uri = await contract._uri(`${beforeTokenID}`);
      expect(_uri).to.equal(uri);
      expect(copies).to.equal(Number(await contract.connect(currentSigner).balanceOf(currentSigner.address, beforeTokenID)));
    });
  });

  describe("Marking For Rent", function () {
    let tokenId, copies, price, startTime, endTime;
    tokenId = copies = price = startTime = endTime = 0;

    it("Should reject request if renting price is not greater than zero", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime)).to.be.revertedWith(
        "Sample5006: Renting price should be be geater than zero"
      );
    });

    it("Should reject request if start and end time is not greater than zero", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      price = 1;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime)).to.be.revertedWith(
        "Sample5006: Timestamps cannot be zero"
      );
    });

    it("Should reject request if start time is greater than end time", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      startTime = 5; endTime = 2;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime)).to.be.revertedWith(
        "Sample5006: Start time should be less than end time"
      );
    });

    it("Should reject request if end time is lesser than current time", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      endTime = 100;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime)).to.be.revertedWith(
        "Sample5006: End time should be greater than current time"
      );
    });

    it("Should not allow lender to mark a token for rent which he/she dont have enough copies", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 1238291083120120; copies = 6;
      await expect(contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime)).to.be.revertedWith(
        "Sample5006: Lender dont have enough token copies"
      );
    });

    it("Should allow token to be marked as rent if all the arguments are valid", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60;

      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);

      const recId = await contract.connect(currentSigner)._recId();
      const record = await contract.connect(currentSigner)._tokenRecords(recId - 1);

      expect(Number(record.tokenId)).to.equal(tokenId);
      expect(Number(record.price)).to.equal(price);
      expect(Number(record.copies)).to.equal(copies);
      expect(Number(record.startTime)).to.equal(startTime);
      expect(Number(record.endTime)).to.equal(endTime);
      expect(record.lender).to.equal(currentSigner.address);
      expect(record.rentedTo).to.equal('0x0000000000000000000000000000000000000000');
    });

  });

  describe('Buying a record', () => {
    let tokenId, copies, price, startTime, endTime;
    tokenId = copies = price = startTime = endTime = 0;

    it("Should allow borrower to borrow valid record Id", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);

      await contract.connect(currentSigner).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') });

      const record = await contract._tokenRecords('0');

      expect(record.rentedTo).to.equal(currentSigner.address);
    });

    it("Should reject request if borrower try to borrow invalid record Id", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');

      await expect(contract.connect(currentSigner).borrowToken('2', { value: ethers.utils.parseEther('2') })).to.be.revertedWith(
        "Sample5006: Invalid Record Id"
      );
    });

    it("Should reject request if borrower try to borrow already lended record", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);

      await contract.connect(currentSigner).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') });

      await expect(contract.connect(signers[1]).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') })).to.be.revertedWith(
        "Sample5006: Record already on rent Cant borrow"
      );
    });

    it("Should reject request if borrower try to borrow record with invalid price", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);

      await expect(contract.connect(currentSigner).borrowToken('0', { value: ethers.utils.parseEther('0.00003') })).to.be.revertedWith(
        "Sample5006: Insufficient price"
      );
    });

    it("Should reject request if borrower try to borrow his/her own record", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);

      await expect(contract.connect(signers[2]).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') })).to.be.revertedWith(
        "Sample5006: Can't buy your own token"
      );
    });

    it("Should reject request if borrower try to borrow record before its startTime", async function () {

      const [currentSigner, contract] = await loadFixture(deployContract);

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');

      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 520; startTime = (Math.floor(Date.now() / 1000)) + 320;
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);

      await expect(contract.connect(currentSigner).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') })).to.be.revertedWith(
        "Sample5006: Record's starttime has NOT REACHED"
      );
    });

    it("Should reject request if borrower try to borrow record whose end time has been passed", async function () {

      const [currentSigner, contract] = await loadFixture(deployContract);

      const signers = (await ethers.getSigners());
      await contract.connect(signers[2]).mintToken('my URI', '100');

      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 2; startTime = 10;
      await contract.connect(signers[2]).markForRent(tokenId, copies, price, startTime, endTime);
      setTimeout(async () => {
        await expect(contract.connect(currentSigner).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') })).to.be.revertedWith(
          "Sample5006: Record's endtime has been expired"
        );
      }, 3000);
    });

  });

  describe('Removing from rent', () => {
    let tokenId, copies, price, startTime, endTime;
    tokenId = copies = price = startTime = endTime = 0;

    it("Should allow lender to remove his/her marked record", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);

      await contract.connect(currentSigner).removeFromRent('0');
      const record = await contract.connect(currentSigner)._tokenRecords('0');

      expect(Number(record.tokenId)).to.equal(0);
      expect(Number(record.price)).to.equal(0);
      expect(Number(record.copies)).to.equal(0);
      expect(Number(record.startTime)).to.equal(0);
      expect(Number(record.endTime)).to.equal(0);
      expect(record.lender).to.equal('0x0000000000000000000000000000000000000000');
      expect(record.rentedTo).to.equal('0x0000000000000000000000000000000000000000');
    });

    it("Should reject lender request to remove record that does not exists", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);

      await expect(contract.connect(currentSigner).removeFromRent('0')).to.be.revertedWith(
        "Sample5006: Invalid Record Id"
      );
    });

    it("Should reject lender request to remove record that is not owned by him", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      const signers = await ethers.getSigners();

      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);


      await expect(contract.connect(signers[2]).removeFromRent('0')).to.be.revertedWith(
        "Sample5006: Not an valid owner of record"
      );
    });

    it("Should reject lender request to remove record that is already on rent", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      const signers = await ethers.getSigners();

      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);
      await contract.connect(signers[1]).borrowToken('0', { value: ethers.utils.parseEther('0.00000000000000001') });


      await expect(contract.connect(currentSigner).removeFromRent('0')).to.be.revertedWith(
        "Sample5006: Token is on rent Cant remove record"
      );
    });

  });

  describe('Update frozen balance of lender', () => {
    let tokenId, copies, price, startTime, endTime;
    tokenId = copies = price = startTime = endTime = 0;

    it("Should freeze lender balance when lender mark his record for rent", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      await contract.connect(currentSigner).mintToken('my URI', '100');
      const frozenBalance = Number(await contract.getLenderFrozenBalance('0'));
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);

      expect(frozenBalance + copies).to.equal(Number(await contract.getLenderFrozenBalance('0')));
    });

    it("Should release frozen balance of lender when lender remove his/her record", async function () {
      const [currentSigner, contract] = await loadFixture(deployContract);
      tokenId = 0; copies = 1; price = 10; endTime = (Math.floor(Date.now() / 1000)) + 60; startTime = 10;

      await contract.connect(currentSigner).mintToken('my URI', '100');
      await contract.connect(currentSigner).markForRent(tokenId, copies, price, startTime, endTime);
      const frozenBalance = Number(await contract.getLenderFrozenBalance('0'));
      await contract.connect(currentSigner).removeFromRent('0');

      expect(Math.abs(frozenBalance - copies)).to.equal(Number(await contract.getLenderFrozenBalance('0')));
    });


  });
  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});

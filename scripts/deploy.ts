import { ethers } from "hardhat";

async function main() {
  const FACTORY_ADDRESS = '0xeD59E0B12aA739d346Fc5116c46f9cD4E6C7012c';
  const Multicall2 = await ethers.getContractFactory("Multicall2");
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const TickLens = await ethers.getContractFactory("TickLens");
  const Quoter = await ethers.getContractFactory("Quoter");
  const SwapRouter = await ethers.getContractFactory("SwapRouter");
  const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const NonfungiblePositionManager = await ethers.getContractFactory("NonfungiblePositionManager");
  const V3Migrator = await ethers.getContractFactory("V3Migrator");
  const WETH9 = await ethers.getContractFactory("WETH9");

  // let weth9;
  // let multicall2;
  // let proxyAdmin;
  // let transparentUpgradeableProxy;

  // if(network === 'uzheth')
  const multicall2 = await Multicall2.deploy();
  console.log("Multicall2 deployed to address:", multicall2.address);
  console.log(multicall2.deployTransaction.hash);
  await multicall2.deployed();

  // if(network === 'uzheth')
  const weth9 = await WETH9.deploy()
  console.log("WETH9 deployed to address:", weth9.address);
  console.log(weth9.deployTransaction.hash);
  await weth9.deployed();

  // if(network === 'uzheth')
  const proxyAdmin = await ProxyAdmin.deploy()
  console.log("ProxyAdmin deployed to address:", proxyAdmin.address);
  console.log(proxyAdmin.deployTransaction.hash);
  await proxyAdmin.deployed();

  const tickLens = await TickLens.deploy();
  console.log("TickLens deployed to address:", tickLens.address);
  console.log(tickLens.deployTransaction.hash);
  await tickLens.deployed();

  const quoter = await Quoter.deploy(FACTORY_ADDRESS, weth9.address);
  console.log("Quoter deployed to address:", quoter.address);
  console.log(quoter.deployTransaction.hash);
  await quoter.deployed();

  const swapRouter = await SwapRouter.deploy(FACTORY_ADDRESS, weth9.address);
  console.log("SwapRouter deployed to address:", swapRouter.address);
  console.log(swapRouter.deployTransaction.hash);
  await swapRouter.deployed();

  const nftDescriptor = await NFTDescriptor.deploy();
  console.log("NFTDescriptor deployed to address:", nftDescriptor.address);
  console.log(nftDescriptor.deployTransaction.hash);
  await nftDescriptor.deployed();

  const NonfungibleTokenPositionDescriptor = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor", {
    libraries: {
      NFTDescriptor: nftDescriptor.address,
    },
  });
  const nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy(weth9.address);
  console.log("NonfungibleTokenPositionDescriptor deployed to address:", nonfungibleTokenPositionDescriptor.address);
  console.log(nonfungibleTokenPositionDescriptor.deployTransaction.hash);
  await nonfungibleTokenPositionDescriptor.deployed();

  const transparentUpgradeableProxy = await TransparentUpgradeableProxy.deploy(nonfungibleTokenPositionDescriptor.address, proxyAdmin.address, []);
  console.log("TransparentUpgradeableProxy deployed to address:", transparentUpgradeableProxy.address);
  console.log(transparentUpgradeableProxy.deployTransaction.hash);
  await transparentUpgradeableProxy.deployed();

  const nonfungiblePositionManager = await NonfungiblePositionManager.deploy(FACTORY_ADDRESS, weth9.address, transparentUpgradeableProxy.address);
  console.log("NonfungiblePositionManager deployed to address:", nonfungiblePositionManager.address);
  console.log(nonfungiblePositionManager.deployTransaction.hash);
  await nonfungiblePositionManager.deployed();

  const v3Migrator = await V3Migrator.deploy(FACTORY_ADDRESS, weth9.address, nonfungiblePositionManager.address);
  console.log("V3Migrator deployed to address:", v3Migrator.address);
  console.log(v3Migrator.deployTransaction.hash);
  await v3Migrator.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


// UniswapV3Factory -> 0xeD59E0B12aA739d346Fc5116c46f9cD4E6C7012c
// Multicall2 -> ()
// ProxyAdmin -> ()
// TickLens   -> ()
// Quoter     -> (factory, WETH9)
// SwapRouter -> (factory, WETH9)
// NFTDescriptor -> ()
// NonfungibleTokenPositionDescriptor -> (WETH9)
// TransparentUpgradeableProxy -> (NonfungibleTokenPositionDescriptor, ProxyAdmin)
// NonfungiblePositionManager -> (factory, WETH9, TransparentUpgradeableProxy)
// V3Migrator -> factory, _WETH9, _nonfungiblePositionManager

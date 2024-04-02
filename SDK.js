const { BalancerSDK, Network } = require('@balancer-labs/sdk');

const config = {
  network: Network.MAINNET,
  //rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA}`,
  rpcUrl: `http://127.0.0.1:8545`,
};
const balancer = new BalancerSDK(config);
async function main() {
    const pool = await balancer.pools.find(poolId);
    const { to, functionName, attributes, data } = pool.buildJoin(params);
    console.log(pool)
    
    const { swaps } = balancer // Swaps module is abstracting SOR
};


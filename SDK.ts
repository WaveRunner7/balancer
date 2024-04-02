import { BalancerSDK, BalancerSdkConfig, Network } from '@balancer-labs/sdk';

const config: BalancerSdkConfig = {
  network: Network.MAINNET,
  rpcUrl: `http://127.0.0.1:8545`,
};
const balancer = new BalancerSDK(config);
const { swaps } = balancer

async function main() {
  //const pool = await balancer.pools.find("0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7");
  const the_swaps = await swaps.fetchPools();
  console.log(the_swaps);
  //const { to, functionName, attributes, data } = pool.buildJoin(params);


}

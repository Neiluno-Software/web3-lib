import * as dotenv from 'dotenv';
// import { testToken } from './token';
import { walletTest } from './wallet';
import { tokenTest } from './token';
import { deBridgeTest, swingTest } from './3rdparty';
import { commonTest } from './commcon';
import { alchemyTest } from './3rdparty/alchemy';
import { bridgeTest } from './trade';

dotenv.config()

export const solPrivKey = process.env.SOL_PRIV_KEY!
export const evmPrivKey = process.env.EVM_PRIV_KEY!
export const solanaRpc = process.env.RPC_SOLANA!
export const ethRpc = process.env.RPC_ETHEREUM!

async function test() {
  tokenTest()
  // walletTest()
  // swingTest()
  // commonTest()
  // alchemyTest()
  // deBridgeTest()
  // bridgeTest()
}

test()
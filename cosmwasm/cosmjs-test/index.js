import {Tendermint34Client} from '@cosmjs/tendermint-rpc';
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {GasPrice} from "@cosmjs/stargate";


const CONTRACT_ADDRESS = "neutron170dx8d3gj02muxd46curuv3p6w88fhz80hgs70ut0d2ulekmsqmsv5uvfw"
const CW721_ADDRESS = "neutron1gm633m8ffp4a50593x46gg0a0ltxsefrr44wyqvltd00wa6zs99qt3wl96"
const ADDRESS_OF_SIGNER = "neutron1jasv3ukqhq5e7fskdaprn3cyy2n3uzj7f00jvv"
const MNEMONIC_OF_SIGNER = "model confirm giggle correct abstract find observe broccoli crunch tuition episode judge alpha diesel soft drip become lobster wrestle fantasy ivory genuine physical trash"
const RPC_ENDPOINT = "https://rpc-palvus.pion-1.ntrn.tech:443"
const CONNECTION_ID = "connection-32"

const tm37Client = await Tendermint34Client.connect(RPC_ENDPOINT);
const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC_OF_SIGNER, {
  prefix: 'neutron',
});
const client = await SigningCosmWasmClient.createWithSigner(
  tm37Client,
  signer,
  {
    gasPrice: GasPrice.fromString('0.025untrn'),
  }
);

const contractInfo = await client.queryContractSmart(CONTRACT_ADDRESS, {
  "nftokenizer_contract_info": {}
});
console.log(contractInfo);

const tokensByOwner = await client.queryContractSmart(CW721_ADDRESS, {
  "tokens": {
    "owner": ADDRESS_OF_SIGNER
  }
});
console.log("Tokens by owner:", tokensByOwner);

const createNftSlotResp = await client.execute(ADDRESS_OF_SIGNER, CONTRACT_ADDRESS, {
  "create_slot": {
    "connection_id": CONNECTION_ID
  }
}, "auto")

let slotId = "";
for (const event of createNftSlotResp.events) {
  if (event.type === "wasm") {
    for (const attr of event.attributes) {
      if (attr.key === "nft_slot_id") {
        slotId = attr.value;
      }
    }
  }
}
console.log("Slot ID:", slotId);
if (slotId === "") {
  throw new Error("Slot ID not found");
}

const maxTries = 25;
let tries = 0;
let icaAddress = "";
while (true) {
  const slotInfo = await client.queryContractSmart(CONTRACT_ADDRESS, {
    "nft_slot": {
      "nft_slot_id": slotId
    }
  });
  console.log("Slot info:", slotInfo);
  if (slotInfo.nft_slot.ica_address) {
    icaAddress = slotInfo.nft_slot.ica_address;
    break;
  }
  tries++;
  if (tries > maxTries) {
    throw new Error("Max tries exceeded");
  }
  console.log("Waiting for ICA address... try #" + tries);
  await new Promise(resolve => setTimeout(resolve, 10000));
}

console.log("ICA address:", icaAddress);
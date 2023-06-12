import {CosmWasmClient, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {OfflineSigner} from "@cosmjs/proto-signing";
import {GasPrice} from "@cosmjs/stargate";

const CONTRACT_ADDRESS = "neutron170dx8d3gj02muxd46curuv3p6w88fhz80hgs70ut0d2ulekmsqmsv5uvfw"
const CW721_ADDRESS = "neutron1gm633m8ffp4a50593x46gg0a0ltxsefrr44wyqvltd00wa6zs99qt3wl96"
const RPC_ENDPOINT = "https://rpc-palvus.pion-1.ntrn.tech:443"
const CONNECTION_ID = "connection-32"

export const getTokenizedNfts = async (address: string) => {
  console.log("Getting tokenized NFTs for address:", address);
  const queryClient = await CosmWasmClient.connect(RPC_ENDPOINT);
  const tokensByOwner = await queryClient.queryContractSmart(CW721_ADDRESS, {
    "tokens": {
      "owner": address
    }
  });
  console.log("Tokens by owner:", tokensByOwner);
}

export const createNftSlot = async (addressOfSigner: string, signer: OfflineSigner) => {
  const txClient = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, signer, {
    gasPrice: GasPrice.fromString('0.025untrn'),
  });

  const createNftSlotResp = await txClient.execute(addressOfSigner, CONTRACT_ADDRESS, {
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
    const slotInfo = await txClient.queryContractSmart(CONTRACT_ADDRESS, {
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
  return slotId;
}

export const mintNftFromSlot = async (addressOfSigner: string, signer: OfflineSigner, slotId: string) => {
  const txClient = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, signer, {
    gasPrice: GasPrice.fromString('0.025untrn'),
  });

  const createNftSlotResp = await txClient.execute(addressOfSigner, CONTRACT_ADDRESS, {
    "mint_nft_from_slot": {
      "nft_slot_id": slotId
    }
  }, "auto");

  // TODO: now what...?
}
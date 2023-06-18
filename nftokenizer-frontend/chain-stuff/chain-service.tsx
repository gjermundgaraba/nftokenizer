import {CosmWasmClient, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {OfflineSigner} from "@cosmjs/proto-signing";
import {GasPrice} from "@cosmjs/stargate";
import {NftSlot, nftSlotFromJson} from "../models/nft-slot";

const CONTRACT_ADDRESS = "neutron1zkjxwed2kr6eu46hztheeqjkgmntkacd6tadteqwqk9l04x3gmjq4maq32"
const CW721_ADDRESS = "neutron1qpdj87vl4sl9uwkzald6afawvulu6whun69fxmrcr0xp4khdlzyqf4jj94"
const NEUTRON_RPC_ENDPOINT = "https://rpc-palvus.pion-1.ntrn.tech:443"
const CONNECTION_ID = "connection-32"

export const getNftSlot = async (slotId: string) => {
  const queryClient = await CosmWasmClient.connect(NEUTRON_RPC_ENDPOINT);
  const response = await queryClient.queryContractSmart(CONTRACT_ADDRESS, {
    "nft_slot": {
      "nft_slot_id": slotId
    }
  });

  return nftSlotFromJson(response);
}

export const getOpenNftSlots = async (address: string): Promise<NftSlot[]> => {
  const queryClient = await CosmWasmClient.connect(NEUTRON_RPC_ENDPOINT);
  const response = await queryClient.queryContractSmart(CONTRACT_ADDRESS, {
    "nft_slots_by_creator": {
      "creator": address
    }
  });

  return response.nft_slots
    .map(nftSlotFromJson)
    .filter((nftSlot: NftSlot) => !nftSlot.minted);
}

export const createNftSlot = async (addressOfSigner: string, signer: OfflineSigner, metadata: string) => {
  const txClient = await SigningCosmWasmClient.connectWithSigner(NEUTRON_RPC_ENDPOINT, signer, {
    gasPrice: GasPrice.fromString('0.025untrn'),
  });

  const createNftSlotResp = await txClient.execute(addressOfSigner, CONTRACT_ADDRESS, {
    "create_slot": {
      "connection_id": CONNECTION_ID,
      "metadata": metadata
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

  return slotId;
}

export const waitForSlotToBeReady = async (slotId: string) => {
  const queryClient = await CosmWasmClient.connect(NEUTRON_RPC_ENDPOINT);
  console.log("Slot ID:", slotId);
  if (slotId === "") {
    throw new Error("Slot ID not found");
  }

  const maxTries = 25;
  let tries = 0;
  let icaAddress = "";
  while (true) {
    const slotInfo = await queryClient.queryContractSmart(CONTRACT_ADDRESS, {
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
  return icaAddress;
}

export const mintNftFromSlot = async (addressOfSigner: string, signer: OfflineSigner, slotId: string) => {
  const txClient = await SigningCosmWasmClient.connectWithSigner(NEUTRON_RPC_ENDPOINT, signer, {
    gasPrice: GasPrice.fromString('0.025untrn'),
  });

  await txClient.execute(addressOfSigner, CONTRACT_ADDRESS, {
    "mint_nft_from_slot": {
      "nft_slot_id": slotId
    }
  }, "auto");
}

export const getTokenizedNfts = async (address: string) => {
  console.log("Getting tokenized NFTs for address:", address);
  const queryClient = await CosmWasmClient.connect(NEUTRON_RPC_ENDPOINT);
  const tokensByOwner = await queryClient.queryContractSmart(CW721_ADDRESS, {
    "tokens": {
      "owner": address
    }
  });
  return tokensByOwner.tokens;
}
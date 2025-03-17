import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "./aptosClient";


type GetMintEnabledArguments = {
  fa_address: string;
};

export const getMintEnabled = async ({ fa_address }: GetMintEnabledArguments) => {
  const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1"
  const mintEnabled = await aptosClient().view<[boolean]>({
    payload: {
      function: `${AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::is_mint_enabled`,
      functionArguments: [fa_address],
    },
  });

  return mintEnabled[0];
};

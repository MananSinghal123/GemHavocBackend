import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "./aptosClient";

type GetUserMintBalanceArguments = {
  fa_address: string;
  user_address: string;
};

export const getUserMintBalance = async ({ fa_address, user_address }: GetUserMintBalanceArguments) => {
  const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1"
  const userMintedAmount = await aptosClient().view<[string]>({
    payload: {
      function: `${AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::get_mint_balance`,
      functionArguments: [fa_address, user_address],
    },
  });

  return Number(userMintedAmount[0]);
};

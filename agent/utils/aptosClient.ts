// import { APTOS_API_KEY, NETWORK } from "../constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(
  new AptosConfig({
    network: Network.TESTNET,
    clientConfig: { API_KEY: "aptoslabs_YHqHs1RkqEE_PJxfjAYDHRWLwhtvoA8FGpfz44aqQ3CPC" },
  })
);

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}

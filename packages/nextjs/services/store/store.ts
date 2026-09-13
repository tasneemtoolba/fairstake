import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes, NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

const initialNetwork =
  scaffoldConfig.targetNetworks.find(n => n.id === scaffoldConfig.defaultNetworkId) ?? scaffoldConfig.targetNetworks[0];

export const useGlobalState = create<GlobalState>(set => ({
  targetNetwork: {
    ...initialNetwork,
    ...NETWORKS_EXTRA_DATA[initialNetwork.id],
  },
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));

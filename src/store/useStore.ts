import { create } from "zustand";

type storeInformation = {
    /** screen index of the current screen element!*/
    screenIndex: number;
};
type storeActions = {
    setScreenIndex: (screenIndex: number) => void;
    clearScreenIndex: () => void;
};

const defualtValue: storeInformation = {
    screenIndex: 0,
};

export type storeType = storeInformation & storeActions;

export const useStore = create<storeType>((set) => ({
    ...defualtValue,
    setScreenIndex: (screenIndex: number) => set({ screenIndex }),
    clearScreenIndex: () => set({ screenIndex: 0 }),
}));


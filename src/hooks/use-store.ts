"use client";

import { create } from "zustand";
import { combine } from "zustand/middleware";

import type { Entry } from "~/shared/types";

const LOCAL_STORAGE_ENTRIES_KEY = "entries";
const DEFAULT_STATE = {
    entries: null as Entry[] | null,
};

const cacheEntries = (entries: Entry[]) => {
    console.log("Saving entries to", entries);

    window.localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(entries));
};

export const useInternalStore = create(
    combine(DEFAULT_STATE, set => ({
        initialiseEntries: () =>
            set(() => {
                const entriesFound = window.localStorage.getItem(LOCAL_STORAGE_ENTRIES_KEY);

                console.log("Entries:", entriesFound);

                if (!entriesFound) {
                    const newEntries: Entry[] = [];

                    cacheEntries(newEntries);

                    return { entries: newEntries };
                }

                return { entries: JSON.parse(entriesFound) };
            }),
        setEntries: (entries: Entry[]) =>
            set(() => {
                cacheEntries(entries);

                return { entries };
            }),
        appendEntry: (entry: Entry) =>
            set(state => {
                const newEntries = state.entries ? [...state.entries, entry] : [entry];

                cacheEntries(newEntries);

                return { entries: newEntries };
            }),
    })),
);

type InternalStore = ReturnType<(typeof useInternalStore)["getState"]>;

function useStore(): Record<keyof InternalStore, InternalStore[keyof InternalStore]>;
function useStore<StoreKey extends keyof InternalStore>(
    ...keys: StoreKey[]
): Pick<InternalStore, StoreKey>;
function useStore<StoreKey extends keyof InternalStore>(
    ...keys: StoreKey[]
): Record<StoreKey, InternalStore[StoreKey]> | Pick<InternalStore, StoreKey> {
    const internalStore = useInternalStore();
    const store = {} as Record<StoreKey, InternalStore[StoreKey]>;

    if (keys.length === 0) {
        keys = Object.keys(internalStore) as StoreKey[];
    }

    for (const key of keys) {
        store[key] = internalStore[key];
    }

    return store;
}

export default useStore;

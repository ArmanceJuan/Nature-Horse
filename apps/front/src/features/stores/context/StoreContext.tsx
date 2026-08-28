import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { mockStores } from "../data/mockStores.js";
import type { Store } from "../types/store.types.js";

const STORAGE_KEY = "nature-horse-selected-store";

interface StoreContextValue {
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  stores: Store[];
  isSelectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    const savedStoreId = localStorage.getItem(STORAGE_KEY);
    if (savedStoreId) {
      const found = mockStores.find((s) => s.id === savedStoreId);
      if (found) setSelectedStoreState(found);
    }
  }, []);

  const setSelectedStore = (store: Store) => {
    localStorage.setItem(STORAGE_KEY, store.id);
    setSelectedStoreState(store);
    setIsSelectorOpen(false);
  };

  const openSelector = () => setIsSelectorOpen(true);
  const closeSelector = () => setIsSelectorOpen(false);

  return (
    <StoreContext.Provider
      value={{
        selectedStore,
        setSelectedStore,
        stores: mockStores,
        isSelectorOpen,
        openSelector,
        closeSelector,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

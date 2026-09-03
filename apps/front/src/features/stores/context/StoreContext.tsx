import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Store } from "../types/store.types.js";
import { storesApi } from "../api/storesApi.js";

const STORAGE_KEY = "nature-horse-selected-store";

interface StoreContextValue {
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  stores: Store[];
  isSelectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const fetchedStores: Store[] = await storesApi.getAll();
        setStores(fetchedStores);

        const savedStoreId = localStorage.getItem(STORAGE_KEY);
        if (savedStoreId) {
          const found = fetchedStores.find((s) => s.id === savedStoreId);
          if (found) setSelectedStoreState(found);
        }
      } catch (error) {
        console.error("Failed to load stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStores();
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
        stores,
        isSelectorOpen,
        openSelector,
        closeSelector,
        isLoading,
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

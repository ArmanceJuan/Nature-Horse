import { AppRouter } from "./routes/AppRouter.js";
import { StoreProvider } from "./features/stores/context/StoreContext.js";
import { StoreSelectionModal } from "./features/stores/components/StoreSelectionModal.js";

function App() {
  return (
    <StoreProvider>
      <StoreSelectionModal />
      <AppRouter />
    </StoreProvider>
  );
}

export default App;

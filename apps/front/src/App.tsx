import { AppRouter } from "./routes/AppRouter.js";
import { StoreProvider } from "./features/stores/context/StoreContext.js";
import { StoreSelectionModal } from "./features/stores/components/StoreSelectionModal.js";
import { CartProvider } from "./features/cart/context/CartContext.js";

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <StoreSelectionModal />
        <AppRouter />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;

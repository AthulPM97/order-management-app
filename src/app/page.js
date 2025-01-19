import Home from "@/components/Home";
import { OrdersProvider } from "@/store/OrdersContext";
import { ProductsProvider } from "@/store/ProductsContext";

export default function Main() {
  return (
    <div>
      <ProductsProvider>
        <OrdersProvider>
          <Home />
        </OrdersProvider>
      </ProductsProvider>
    </div>
  );
}

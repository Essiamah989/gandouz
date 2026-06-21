import { getOrders, getProducts } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const currentUserData = await getCurrentUser();
  const allOrders = await getOrders();
  
  // Simple guest order filtering based on user email or customer name
  const filteredOrders = allOrders.filter(
    (o: any) => o.email === currentUserData?.email || o.customerName?.includes(currentUserData?.firstName || "")
  );

  // Fetch a couple of mock products for a populated wishlist
  const allProds = await getProducts();
  const wishlist = allProds.slice(0, 2);

  return <AccountClient user={currentUserData} orders={filteredOrders} wishlist={wishlist} />;
}

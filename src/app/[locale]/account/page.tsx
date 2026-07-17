import { getOrders, getProducts, getOrCreateUserFromClerk } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const currentUserData = await getCurrentUser();
  let dbUser = null;
  if (currentUserData) {
    dbUser = await getOrCreateUserFromClerk(currentUserData);
  }
  
  const allOrders = await getOrders();
  
  // Filter orders by userId or fallback to email
  const filteredOrders = allOrders.filter(
    (o: any) =>
      (dbUser && o.userId === dbUser.id) ||
      o.email === currentUserData?.email ||
      o.customerName?.includes(currentUserData?.firstName || "")
  );

  // Fetch a couple of mock products for a populated wishlist
  const allProds = await getProducts();
  const wishlist = allProds.slice(0, 2);

  return <AccountClient user={dbUser || currentUserData} orders={filteredOrders} wishlist={wishlist} />;
}

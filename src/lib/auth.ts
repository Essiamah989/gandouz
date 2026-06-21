import { auth, currentUser } from "@clerk/nextjs/server";

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export async function getUserRole(): Promise<UserRole> {
  try {
    // Attempt Clerk organization role resolution if active
    const session = await auth();
    if (session?.userId) {
      if (session.orgRole === "org:admin") {
        return "ADMIN";
      }
      if (session.orgRole === "org:staff") {
        return "STAFF";
      }
    }
  } catch (error) {
    // Clerk not configured or environment mock mode
  }

  // Local development mock check: if dev, allow mock admin role
  if (process.env.NODE_ENV === "development") {
    return "ADMIN";
  }

  return "CUSTOMER";
}

export async function getCurrentUser() {
  try {
    const user = await currentUser();
    if (user) {
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumbers[0]?.phoneNumber || ""
      };
    }
  } catch (e) {
    // Clerk not configured
  }

  // Development mock fallback
  return {
    id: "mock-customer-1",
    email: "customer@example.com",
    firstName: "Amine",
    lastName: "Trabelsi",
    phone: "+216 22 111 222"
  };
}

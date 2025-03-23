import { getOrder } from "../data/order/index.js";

// Helper function to generate a random string of a given length.
function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateUniqueOrderNumber(): Promise<string> {
  let order_number = "";
  let exists = true;

  while (exists) {
    order_number = `${Date.now().toString(36)}-${generateRandomString(4)}`;

    exists = await getOrder({ order_number });
  }
  return order_number;
}

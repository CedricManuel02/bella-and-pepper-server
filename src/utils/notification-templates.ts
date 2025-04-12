export const notificationTemplates = {
  PLACED_ORDER: {
    title: "Order Confirmed",
    body: (order_number: string) =>
      `Thank you for your purchase! Your order #${order_number} has been successfully placed. We'll update you once it's processed.`,
  },
  PAID: {
    title: "Payment Successful",
    body: (order_number: string) => `Payment for order #${order_number} has been successfully processed. Please prepare the order for shipment.`,
  },
  SHIPPED: {
    title: "Your Order is on the Way!",
    body: (order_number: string) => `Great news! Your order #${order_number} has been shipped and is on its way.`,
  },
  DELIVERED: {
    title: "Order Successfully Delivered",
    body: (order_number: string) => `Great news! Order #${order_number} has been delivered to its destination.`,
  },
  RATING: {
    title: "Product Rated",
    body: (_: string, product_name: string, user_name: string) => `${user_name} rated your product "${product_name}".`,
  },
  CANCELLED: {
    title: "Order Cancelled",
    body: (order_number: string) => `Order #${order_number} has been cancelled. Please check the details or contact support if necessary.`,
  },
  VIOLATION: {
    title: "Violation of Rating Policy",
    body: (order_number: string) => `The rating for order #${order_number} was removed due to a violation of our rating policy.`,
  },
};

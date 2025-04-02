import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOrdersIncomeByMonthData({ startOfMonth, endOfMonth }: { startOfMonth: Date; endOfMonth: Date }) {
  const orders = await prisma.tbl_orders.findMany({
    where: {
      order_date_created: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      tbl_items: {
        select: {
          item_product_price_at_time_purchase: true,
          item_quantity: true,
        },
      },
    },
  });

  const orders_income = orders.reduce((total, order) => {
    const orderTotal = order.tbl_items.reduce((orderTotal, item) => {
      return orderTotal + item.item_product_price_at_time_purchase * item.item_quantity;
    }, 0);

    return total + orderTotal;
  }, 0);

  return orders_income;
}
export async function getTotalOrdersData({ startOfMonth, endOfMonth }: { startOfMonth: Date; endOfMonth: Date }) {
  const orders = await prisma.tbl_orders.count({
    where: {
      order_date_created: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return orders;
}
export async function getTotalCustomersData({ startOfMonth, endOfMonth }: { startOfMonth: Date; endOfMonth: Date }) {
  const customers = await prisma.tbl_orders.groupBy({
    by: ["user_id"],
    where: {
      order_date_created: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });
  return customers.length;
}
export async function getYearlyMonthlyIncome({current_date} : {current_date: Date}) {
  const income = await prisma.tbl_orders.findMany({
    where: {
      order_date_created: {
        gte: new Date(current_date.getFullYear(), 0, 1),
        lte: new Date(current_date.getFullYear() + 1, 0, 1),
      }
    },
  include: {
    tbl_items: {
      select: {
        item_product_price_at_time_purchase: true,
        item_quantity: true,
      }
    }
  }
  });

  return income;

}
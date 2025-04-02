import { getOrdersIncomeByMonthData, getTotalCustomersData, getTotalOrdersData, getYearlyMonthlyIncome } from "../../data/dashboard/index.js";

export async function getDashboardAnalyticsService(){
    const current_date = new Date();

    const [current_monthly_income, total_orders, total_customers] = await Promise.all([
        getMonthlyIncomeService({current_date}),
        getTotalOrdersService({current_date}),
        getTotalCustomersService({current_date})
    ])

    const data = [current_monthly_income, total_customers, total_orders];

    return data;
}
export async function getDashboardChartService() {
    const current_date = new Date(Date.now());

    const current_year_income = await getYearlyMonthlyIncome({current_date});

    const monthly_income = Array(12).fill(0);

    current_year_income.forEach(item => {
        const month = new Date(item.order_date_created).getMonth();

        const income = item.tbl_items.reduce((sum, item) => sum + item.item_product_price_at_time_purchase * item.item_quantity, 0);

        monthly_income[month] += income;
    });

    const result = monthly_income.map((income, index) => ({
        month: new Date(0, index).toLocaleString("default", {month: "long"}),
        sales: income,
    }));

    return result;
}
async function getMonthlyIncomeService({current_date} : {current_date: Date}) {
    let startOfMonth, endOfMonth, lastMonth, percentage = 0, different = false;

    lastMonth = current_date.getMonth() === 0 ? 11 : current_date.getMonth() - 1;

    // start of the last month income
    startOfMonth = new Date(current_date.getFullYear(), lastMonth, 1);

    // end of the last month income
    endOfMonth = new Date(current_date.getFullYear(), lastMonth + 1, 0);

    // get the last month income 
    const last_monthly_income = await getOrdersIncomeByMonthData({startOfMonth, endOfMonth});

    // start of the month 
    startOfMonth = new Date(current_date.getFullYear(), current_date.getMonth(), 1);

    // last of the month 
    endOfMonth = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0);

    // Get the current month income 
    const current_monthly_income = await getOrdersIncomeByMonthData({startOfMonth, endOfMonth});

    // calculate the percentage 

    if(last_monthly_income > 0) {
        percentage = ((current_monthly_income - last_monthly_income) / last_monthly_income);
        percentage = Math.round(percentage * 10) / 10;
    }

    different = current_monthly_income >= last_monthly_income ? true : false;

    const data = {
        title: "Revenue",
        count: current_monthly_income,
        percentage,
        background: true,
        different
    }

    return data;
}
async function getTotalCustomersService({current_date} : {current_date: Date}) {
    let startOfMonth, endOfMonth, lastMonth, percentage = 0, different = false;

    lastMonth = current_date.getMonth() === 0 ? 11 : current_date.getMonth() - 1;

    // start of the last month orders
    startOfMonth = new Date(current_date.getFullYear(), lastMonth, 1);

    // end of the last month orders
    endOfMonth = new Date(current_date.getFullYear(), lastMonth + 1, 0);

    // get the last month orders 
    const last_monthly_customer = await getTotalCustomersData({startOfMonth, endOfMonth});

    // start of the month 
    startOfMonth = new Date(current_date.getFullYear(), current_date.getMonth(), 1);

    // last of the month 
    endOfMonth = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0);

    // Get the current month orders 
    const current_monthly_customers = await getTotalCustomersData({startOfMonth, endOfMonth});

    // calculate the percentage 

    if(last_monthly_customer > 0) {
        percentage = ((current_monthly_customers - last_monthly_customer) / last_monthly_customer);
        percentage = Math.round(percentage * 10) / 10;
    }

    different = current_monthly_customers >= last_monthly_customer ? true : false;

    const data = {
        title: "Customers",
        count: current_monthly_customers,
        percentage,
        background: false,
        different

    }

    return data;
}
async function getTotalOrdersService({current_date} : {current_date: Date}) {
    let startOfMonth, endOfMonth, lastMonth, percentage = 0, different = false;

    lastMonth = current_date.getMonth() === 0 ? 11 : current_date.getMonth() - 1;

    // start of the last month orders
    startOfMonth = new Date(current_date.getFullYear(), lastMonth, 1);

    // end of the last month orders
    endOfMonth = new Date(current_date.getFullYear(), lastMonth + 1, 0);

    // get the last month orders 
    const last_monthly_orders = await getTotalOrdersData({startOfMonth, endOfMonth});

    // start of the month 
    startOfMonth = new Date(current_date.getFullYear(), current_date.getMonth(), 1);

    // last of the month 
    endOfMonth = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0);

    // Get the current month orders 
    const current_monthly_orders = await getTotalOrdersData({startOfMonth, endOfMonth});

    // calculate the percentage 

    if(last_monthly_orders > 0) {
        percentage = ((current_monthly_orders - last_monthly_orders) / last_monthly_orders);
        percentage = Math.round(percentage * 10) / 10;
    }

    different = current_monthly_orders >= last_monthly_orders ? true : false;

    const data = {
        title: "Orders",
        count: current_monthly_orders,
        percentage,
        background: true,
        different
    }

    return data;
}

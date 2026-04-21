const prisma = require("../lib/prisma");
const AppError = require("../util/AppError");
const vnpayService = require("./vnpayService");
const momoService = require("./momoService");
const payosService = require("./payosService");

const mapPaymentStatus = (paymentMethod) =>
  ["cod", "vnpay", "momo", "payos", "demo"].includes(paymentMethod) ? "pending" : "paid";

const normalizeItems = (items) =>
  items.map((item) => ({
    productId: Number(item.productId),
    quantity: Number(item.quantity),
  }));

const getNextId = async (model, tx) => {
  const result = await tx[model].aggregate({
    _max: {
      id: true,
    },
  });

  return (result._max.id || 0) + 1;
};

const handleGetOrders = async (userId) => {
  const where = {};

  if (userId) {
    where.user_id = Number(userId);
  }

  return prisma.orders.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
      users: true,
    },
  });
};

const handleCreateOrder = async (payload) => {
  const {
    userId,
    receiverName,
    phone,
    address,
    paymentMethod,
    items,
  } = payload;

  const normalizedItems = normalizeItems(items);
  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];

  if (!normalizedItems.length) {
    throw new AppError("Vui lòng chọn ít nhất một sản phẩm để thanh toán", 400);
  }

  const products = await prisma.products.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new AppError("Có sản phẩm trong giỏ không còn tồn tại", 422);
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new AppError(`Không tìm thấy sản phẩm với id = ${item.productId}`, 422);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        422,
      );
    }
  }

  const orderItemsData = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);

    return {
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const totalPrice = orderItemsData.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const nextOrderId = await getNextId("orders", tx);
    let nextOrderItemId = await getNextId("order_items", tx);

    await tx.$executeRaw`
      INSERT INTO orders (id, user_id, total_price, status, receiver_name, phone, address)
      VALUES (${nextOrderId}, ${userId ? Number(userId) : null}, ${totalPrice}, ${mapPaymentStatus(paymentMethod)}, ${receiverName}, ${phone}, ${address})
    `;

    for (const item of orderItemsData) {
      await tx.$executeRaw`
        INSERT INTO order_items (id, order_id, product_id, price, quantity)
        VALUES (${nextOrderItemId++}, ${nextOrderId}, ${item.product_id}, ${item.price}, ${item.quantity})
      `;
    }

    await Promise.all(
      normalizedItems.map((item) =>
        tx.products.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    return tx.orders.findUnique({
      where: { id: nextOrderId },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: true,
      },
    });
  });

  let paymentUrl = null;
  if (paymentMethod === "vnpay") {
    paymentUrl = vnpayService.createPaymentUrl(order, "127.0.0.1"); // ipAddr
    order.paymentUrl = paymentUrl;
  } else if (paymentMethod === "momo") {
    paymentUrl = await momoService.createPaymentUrl(order);
    order.paymentUrl = paymentUrl;
  } else if (paymentMethod === "payos") {
    paymentUrl = await payosService.createPaymentUrl(order);
    order.paymentUrl = paymentUrl;
  } else if (paymentMethod === "demo") {
    // Phương thức thanh toán ảo để giả lập kết quả thành công cho Frontend
    order.paymentUrl = `https://gundam-model.onrender.com/orders/demo_pay?orderId=${order.id}`;
  }

  return order;
};

module.exports = {
  handleCreateOrder,
  handleGetOrders,
};
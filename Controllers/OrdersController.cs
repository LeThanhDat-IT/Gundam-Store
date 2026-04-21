using GundamStoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GundamStoreAPI.Controllers
{
    [Route("/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly GundamStoreContext _context;

        public OrdersController(GundamStoreContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return string.IsNullOrEmpty(userIdClaim) ? 0 : int.Parse(userIdClaim);
        }

        // Lấy danh sách đơn hàng của user
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    o.ReceiverName,
                    o.Phone,
                    o.Address
                })
                .ToListAsync();

            return Ok(orders);
        }

        // Lấy chi tiết đơn hàng
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null) return NotFound();

            return Ok(new
            {
                order.Id,
                order.TotalPrice,
                order.Status,
                order.CreatedAt,
                order.ReceiverName,
                order.Phone,
                order.Address,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.ProductId,
                    ProductName = oi.Product.Name,
                    oi.Price,
                    oi.Quantity
                })
            });
        }

        // Tạo đơn hàng mới từ payload checkout hoặc giỏ hàng server-side
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var requestedItems = request.Items?
                .Where(item => item.ProductId > 0 && item.Quantity > 0)
                .Select(item => new OrderCheckoutItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                })
                .ToList() ?? new List<OrderCheckoutItem>();

            int currentUserId = GetCurrentUserId();

            var itemsToProcess = requestedItems;
            var sourceCartItems = new List<Cart>();

            if (!itemsToProcess.Any() && currentUserId > 0)
            {
                sourceCartItems = await _context.Carts
                    .Include(c => c.Product)
                    .Where(c => c.UserId == currentUserId)
                    .ToListAsync();

                itemsToProcess = sourceCartItems
                    .Where(c => c.ProductId > 0 && (c.Quantity ?? 0) > 0)
                    .Select(c => new OrderCheckoutItem
                    {
                        ProductId = c.ProductId,
                        Quantity = c.Quantity ?? 0
                    })
                    .ToList();
            }

            if (!itemsToProcess.Any())
                return BadRequest(new { message = "Vui lòng chọn ít nhất một sản phẩm để thanh toán" });

            var productIds = itemsToProcess.Select(item => item.ProductId).Distinct().ToList();

            var products = await _context.Products
                .Where(product => productIds.Contains(product.Id))
                .ToListAsync();

            if (products.Count != productIds.Count)
                return UnprocessableEntity(new { message = "Có sản phẩm trong giỏ không còn tồn tại" });

            var productMap = products.ToDictionary(product => product.Id, product => product);

            foreach (var item in itemsToProcess)
            {
                if (!productMap.TryGetValue(item.ProductId, out var product))
                {
                    return UnprocessableEntity(new { message = $"Không tìm thấy sản phẩm với id = {item.ProductId}" });
                }

                if (product.Stock < item.Quantity)
                {
                    return UnprocessableEntity(new { message = $"Sản phẩm {product.Name} không đủ số lượng trong kho" });
                }
            }

            decimal totalPrice = itemsToProcess.Sum(item => productMap[item.ProductId].Price * item.Quantity);

            var paymentMethod = (request.PaymentMethod ?? string.Empty).Trim().ToLowerInvariant();
            var orderStatus = paymentMethod is "cod" ? "pending" : "paid";

            var order = new Order
            {
                UserId = currentUserId > 0 ? currentUserId : null,
                TotalPrice = totalPrice,
                Status = orderStatus,
                CreatedAt = DateTime.UtcNow,
                ReceiverName = request.ReceiverName?.Trim(),
                Phone = request.Phone?.Trim(),
                Address = request.Address?.Trim(),
                OrderItems = itemsToProcess.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    Price = productMap[item.ProductId].Price,
                    Quantity = item.Quantity
                }).ToList()
            };


            _context.Orders.Add(order);

            if (sourceCartItems.Any())
            {
                _context.Carts.RemoveRange(sourceCartItems);
            }

            foreach (var item in itemsToProcess)
            {
                var product = productMap[item.ProductId];
                product.Stock -= item.Quantity;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đặt hàng thành công!",
                data = new
                {
                    order.Id,
                    order.TotalPrice,
                    order.Status,
                    order.CreatedAt,
                    order.ReceiverName,
                    order.Phone,
                    order.Address,
                    PaymentMethod = paymentMethod,
                    Items = order.OrderItems.Select(item => new
                    {
                        item.ProductId,
                        item.Price,
                        item.Quantity
                    })
                }
            });
        }
    }

    public class CreateOrderRequest
    {
        public string ReceiverName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string? PaymentMethod { get; set; }
        public List<OrderCheckoutItem> Items { get; set; } = new();
    }

    public class OrderCheckoutItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

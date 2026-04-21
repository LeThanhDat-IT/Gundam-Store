using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GundamStoreAPI.Models;
using GundamStoreAPI.DTOs;

namespace GundamStoreAPI.Controllers
{
    [Route("/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly GundamStoreContext _context;

        public ProductsController(GundamStoreContext context)
        {
            _context = context;
        }

        // 1. LẤY TẤT CẢ SẢN PHẨM (Kèm lọc)
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int? categoryId, [FromQuery] int? subcategoryId)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            if (subcategoryId.HasValue)
            {
                query = query.Where(p => p.SubcategoryId == subcategoryId);
            }

            // FIX LỖI Ở ĐÂY: Sử dụng tên thuộc tính chính xác từ Model Product của bạn
            var products = await query
                .Include("Category")    // Dùng chuỗi string để an toàn tuyệt đối nếu bị trùng tên
                .Include("Subcategory")
                .AsNoTracking()
                .ToListAsync();

            return Ok(products);
        }

        // 2. TÌM KIẾM
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string name)
        {
            if (string.IsNullOrEmpty(name)) return await GetProducts(null, null);

            var products = await _context.Products
                .Where(p => p.Name.Contains(name))
                .Include("Category")
                .ToListAsync();

            return Ok(products);
        }

        // 3. LẤY CHI TIẾT
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products
                .Include("Category")
                .Include("Subcategory")
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound(new { message = "Sản phẩm không tồn tại!" });

            return Ok(product);
        }

        // 4. THÊM (Admin)
        [HttpPost]
        public async Task<IActionResult> PostProduct([FromBody] CreateProductRequest request)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "CategoryId không tồn tại!" });
            }

            var subcategoryExists = await _context.Subcategories.AnyAsync(s => s.Id == request.SubcategoryId && s.CategoryId == request.CategoryId);
            if (!subcategoryExists)
            {
                return BadRequest(new { message = "SubcategoryId không tồn tại hoặc không thuộc category đã chọn!" });
            }

            var product = new Product
            {
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                CategoryId = request.CategoryId,
                SubcategoryId = request.SubcategoryId,
                Location = request.Location,
                Tag = request.Tag,
                Stock = request.Stock,
                CreatedAt = DateTime.Now
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // 5. CẬP NHẬT (Admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] CreateProductRequest request)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound(new { message = "Sản phẩm không tồn tại!" });

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "CategoryId không tồn tại!" });
            }

            var subcategoryExists = await _context.Subcategories.AnyAsync(s => s.Id == request.SubcategoryId && s.CategoryId == request.CategoryId);
            if (!subcategoryExists)
            {
                return BadRequest(new { message = "SubcategoryId không tồn tại hoặc không thuộc category đã chọn!" });
            }

            product.Name = request.Name;
            product.Price = request.Price;
            product.Description = request.Description;
            product.CategoryId = request.CategoryId;
            product.SubcategoryId = request.SubcategoryId;
            product.Location = request.Location;
            product.Tag = request.Tag;
            product.Stock = request.Stock;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công!", data = product });
        }

        // 6. XÓA (Admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa thành công!" });
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
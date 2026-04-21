using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GundamStoreAPI.Models;
using GundamStoreAPI.DTOs;

namespace GundamStoreAPI.Controllers
{
    [Route("/subcategories")]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly GundamStoreContext _context;

        public SubcategoriesController(GundamStoreContext context)
        {
            _context = context;
        }

        // 1. LẤY TẤT CẢ DANH MỤC CON
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategories()
        {
            return await _context.Subcategories
                .Include(s => s.Category) // Lấy kèm thông tin danh mục cha
                .AsNoTracking()
                .ToListAsync();
        }

        // 2. LẤY DANH MỤC CON THEO ID CHA (Rất quan trọng cho React làm Filter)
        // GET: api/subcategories/category/1
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategoriesByCategory(int categoryId)
        {
            var subcategories = await _context.Subcategories
                .Where(s => s.CategoryId == categoryId)
                .ToListAsync();

            return Ok(subcategories);
        }

        // 3. LẤY CHI TIẾT 1 DANH MỤC CON
        [HttpGet("{id}")]
        public async Task<ActionResult<Subcategory>> GetSubcategory(int id)
        {
            var subcategory = await _context.Subcategories
                .Include(s => s.Category)
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (subcategory == null) return NotFound();

            return subcategory;
        }

        // 4. THÊM MỚI (Admin)
        [HttpPost]
        public async Task<ActionResult<Subcategory>> PostSubcategory([FromBody] CreateSubcategoryRequest request)
        {
            // Kiểm tra xem CategoryId gửi lên có tồn tại không
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục cha (CategoryId) không tồn tại!" });
            }

            var subcategory = new Subcategory
            {
                Name = request.Name,
                CategoryId = request.CategoryId
            };

            _context.Subcategories.Add(subcategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubcategory), new { id = subcategory.Id }, subcategory);
        }

        // 5. CẬP NHẬT (Admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubcategory(int id, [FromBody] CreateSubcategoryRequest request)
        {
            var subcategory = await _context.Subcategories.FirstOrDefaultAsync(s => s.Id == id);
            if (subcategory == null) return NotFound();

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục cha (CategoryId) không tồn tại!" });
            }

            subcategory.Name = request.Name;
            subcategory.CategoryId = request.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công!", data = subcategory });
        }

        // 6. XÓA (Admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubcategory(int id)
        {
            var subcategory = await _context.Subcategories.FindAsync(id);
            if (subcategory == null) return NotFound();

            _context.Subcategories.Remove(subcategory);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa danh mục con!" });
        }
    }
}
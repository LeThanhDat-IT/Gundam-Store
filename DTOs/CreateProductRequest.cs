namespace GundamStoreAPI.DTOs;

public class CreateProductRequest
{
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public int SubcategoryId { get; set; }
    public string? Location { get; set; }
    public string? Tag { get; set; }
    public int Stock { get; set; }
}

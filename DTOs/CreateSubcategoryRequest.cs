namespace GundamStoreAPI.DTOs;

public class CreateSubcategoryRequest
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
}

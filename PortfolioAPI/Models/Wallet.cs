using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioAPI.Models;

public class Wallet
{
    public int Id { get; set; }

    public int UserId { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty; // Apelido da carteira
    
    [Required]
    public string Broker { get; set; } = string.Empty; // Corretora
    
    [Required]
    public string OwnerName { get; set; } = string.Empty; // Nome da pessoa (Familiar)
    
    public string Color { get; set; } = "#000000"; // Cor para identificação visual

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserId")]
    public User? User { get; set; }
}

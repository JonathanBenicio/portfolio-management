namespace Portfolio.Domain.Entities;

public class DesignSystemConfig
{
    public int Id { get; set; }
    public int UserId { get; set; }

    // Colors - Primary
    public string PrimaryMain { get; set; } = "#009963";
    public string PrimaryLight { get; set; } = "#33AD7F";
    public string PrimaryDark { get; set; } = "#006B45";

    // Colors - Secondary
    public string SecondaryMain { get; set; } = "#0066CC";
    public string SecondaryLight { get; set; } = "#3385D6";
    public string SecondaryDark { get; set; } = "#00478F";

    // Typography
    public string FontFamily { get; set; } = "Inter, Roboto, Helvetica, Arial, sans-serif";
    public int H1FontSize { get; set; } = 96;
    public int H2FontSize { get; set; } = 60;
    public int H3FontSize { get; set; } = 48;
    public int H4FontSize { get; set; } = 34;
    public int H5FontSize { get; set; } = 24;
    public int H6FontSize { get; set; } = 20;
    public int BodyFontSize { get; set; } = 16;

    // Spacing
    public int SpacingUnit { get; set; } = 8;

    // Shape
    public int BorderRadius { get; set; } = 8;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}

namespace Portfolio.Application.DTOs.DesignSystem;

public record DesignSystemConfigDto(
    string PrimaryMain = "#009963",
    string PrimaryLight = "#33AD7F",
    string PrimaryDark = "#006B45",
    string SecondaryMain = "#0066CC",
    string SecondaryLight = "#3385D6",
    string SecondaryDark = "#00478F",
    string FontFamily = "Inter, Roboto, Helvetica, Arial, sans-serif",
    int H1FontSize = 96,
    int H2FontSize = 60,
    int H3FontSize = 48,
    int H4FontSize = 34,
    int H5FontSize = 24,
    int H6FontSize = 20,
    int BodyFontSize = 16,
    int SpacingUnit = 8,
    int BorderRadius = 8
);

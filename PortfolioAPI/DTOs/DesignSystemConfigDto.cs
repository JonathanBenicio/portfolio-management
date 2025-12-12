namespace PortfolioAPI.DTOs
{
    public class DesignSystemConfigDto
    {
        public string PrimaryMain { get; set; } = "#009963";
        public string PrimaryLight { get; set; } = "#33AD7F";
        public string PrimaryDark { get; set; } = "#006B45";
        public string SecondaryMain { get; set; } = "#0066CC";
        public string SecondaryLight { get; set; } = "#3385D6";
        public string SecondaryDark { get; set; } = "#00478F";
        public string FontFamily { get; set; } = "Inter, Roboto, Helvetica, Arial, sans-serif";
        public int H1FontSize { get; set; } = 96;
        public int H2FontSize { get; set; } = 60;
        public int H3FontSize { get; set; } = 48;
        public int H4FontSize { get; set; } = 34;
        public int H5FontSize { get; set; } = 24;
        public int H6FontSize { get; set; } = 20;
        public int BodyFontSize { get; set; } = 16;
        public int SpacingUnit { get; set; } = 8;
        public int BorderRadius { get; set; } = 8;
    }
}

namespace Portfolio.Domain.Exceptions;

public class ValidationException : DomainException
{
    public IReadOnlyDictionary<string, string[]>? Errors { get; }

    public ValidationException(string message) : base(message) { }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>(errors);
    }
}

namespace Portfolio.Domain.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string entity, object key)
        : base($"{entity} with key '{key}' was not found.") { }

    public NotFoundException(string message) : base(message) { }
}

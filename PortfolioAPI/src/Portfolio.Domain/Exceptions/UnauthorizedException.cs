namespace Portfolio.Domain.Exceptions;

public class UnauthorizedException : DomainException
{
    public UnauthorizedException(string message = "You are not authorized to perform this action.")
        : base(message) { }
}

# Running Tests

## Frontend Tests (Vitest)

### Setup
The project uses Vitest for frontend testing with React Testing Library.

### Running Tests

```powershell
# Inside the frontend container
docker compose exec frontend npm test

# Run tests with UI
docker compose exec frontend npm run test:ui

# Run tests with coverage
docker compose exec frontend npm run test:coverage
```

### Test Files
- `portfolio-app/tests/api.test.ts` - API unit tests
- `portfolio-app/tests/setup.ts` - Test configuration

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should render correctly', () => {
    // Your test here
  });
});
```

---

## Backend Tests (xUnit)

### Setup
The project uses xUnit for backend testing with EF Core InMemory database.

### Running Tests

```powershell
# Navigate to test project
cd PortfolioAPI.Tests

# Run all tests
dotnet test

# Run with verbosity
dotnet test --logger "console;verbosity=detailed"

# Run with coverage
dotnet test /p:CollectCoverage=true
```

### Test Files
- `PortfolioAPI.Tests/AuthControllerTests.cs` - Authentication controller tests

### Writing Tests
```csharp
[Fact]
public async Task TestName_Scenario_ExpectedResult()
{
    // Arrange
    var context = GetInMemoryContext();
    
    // Act
    var result = await controller.Method();
    
    // Assert
    Assert.IsType<OkObjectResult>(result);
}
```

---

## Test Coverage Goals
- **Controllers**: 80%+
- **API Integration**: 70%+
- **Components**: 60%+

---

## CI/CD Integration
Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
steps:
  - name: Run Frontend Tests
    run: npm test
    
  - name: Run Backend Tests
    run: dotnet test
```

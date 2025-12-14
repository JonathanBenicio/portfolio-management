# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution file
COPY ["Portfolio.sln", "./"]

# Copy all project files
COPY ["src/Portfolio.Domain/Portfolio.Domain.csproj", "src/Portfolio.Domain/"]
COPY ["src/Portfolio.Application/Portfolio.Application.csproj", "src/Portfolio.Application/"]
COPY ["src/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj", "src/Portfolio.Infrastructure/"]
COPY ["src/Portfolio.WebAPI/Portfolio.WebAPI.csproj", "src/Portfolio.WebAPI/"]

# Restore dependencies
RUN dotnet restore "Portfolio.sln"

# Copy all source code
COPY . .

# Build the WebAPI project
WORKDIR "/src/src/Portfolio.WebAPI"
RUN dotnet build "Portfolio.WebAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Portfolio.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Portfolio.WebAPI.dll"]

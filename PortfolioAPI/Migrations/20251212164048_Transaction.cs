using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PortfolioAPI.Migrations
{
    /// <inheritdoc />
    public partial class Transaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WalletId",
                table: "VariableIncomeAssets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WalletId",
                table: "FixedIncomeAssets",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    EntityType = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<int>(type: "integer", nullable: false),
                    Action = table.Column<string>(type: "text", nullable: false),
                    Changes = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariableIncomeAssets_WalletId",
                table: "VariableIncomeAssets",
                column: "WalletId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedIncomeAssets_WalletId",
                table: "FixedIncomeAssets",
                column: "WalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedIncomeAssets_Wallets_WalletId",
                table: "FixedIncomeAssets",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VariableIncomeAssets_Wallets_WalletId",
                table: "VariableIncomeAssets",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedIncomeAssets_Wallets_WalletId",
                table: "FixedIncomeAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_VariableIncomeAssets_Wallets_WalletId",
                table: "VariableIncomeAssets");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_VariableIncomeAssets_WalletId",
                table: "VariableIncomeAssets");

            migrationBuilder.DropIndex(
                name: "IX_FixedIncomeAssets_WalletId",
                table: "FixedIncomeAssets");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "VariableIncomeAssets");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "FixedIncomeAssets");
        }
    }
}

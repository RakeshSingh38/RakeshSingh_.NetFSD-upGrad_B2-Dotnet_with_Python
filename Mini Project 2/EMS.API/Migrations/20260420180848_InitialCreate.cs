using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AppUsers",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$12$ipndEf/1p9jdMYbdUWDDrOF1LRVlvxI3tRErZYb5tQzjG2YUPOUyC", "Admin", "admin" },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$12$eWJKQBW5QfPnc8JsxDl9k.aQAetORxOMGEsaNdyrRzzzKhcTnvJSO", "Viewer", "viewer" }
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "DevOps Engineer", "pooja.ghosh@xyz.com", "Pooja", new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Ghosh", "9876543201", 980000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Supply Chain Analyst", "amit.joshi@xyz.com", "Amit", new DateTime(2025, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Joshi", "9876543202", 720000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "Brand Manager", "lakshmi.chandran@xyz.com", "Lakshmi", new DateTime(2025, 7, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Chandran", "9876543203", 840000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Tax Consultant", "suresh.babu@xyz.com", "Suresh", new DateTime(2025, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Babu", "9876543204", 910000m, "Inactive", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "QA Engineer", "meera.krishnan@xyz.com", "Meera", new DateTime(2026, 1, 16, 0, 0, 0, 0, DateTimeKind.Utc), "Krishnan", "9876543205", 690000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "Software Engineer", "rohan.kapoor@xyz.com", "Rohan", new DateTime(2026, 8, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Kapoor", "9876543206", 830000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "HR Executive", "ananya.sen@xyz.com", "Ananya", new DateTime(2025, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Sen", "9876543207", 620000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Accounts Manager", "karthik.iyer@xyz.com", "Karthik", new DateTime(2025, 10, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Iyer", "9876543208", 990000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "SEO Specialist", "nisha.verma@xyz.com", "Nisha", new DateTime(2026, 1, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Verma", "9876543209", 570000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Logistics Manager", "harish.naidu@xyz.com", "Harish", new DateTime(2025, 4, 17, 0, 0, 0, 0, DateTimeKind.Utc), "Naidu", "9876543210", 810000m, "Inactive", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "Talent Partner", "ritika.sharma@xyz.com", "Ritika", new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sharma", "9876543211", 760000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "Backend Developer", "vikas.nair@xyz.com", "Vikas", new DateTime(2025, 12, 11, 0, 0, 0, 0, DateTimeKind.Utc), "Nair", "9876543212", 1040000m, "Inactive", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "Content Strategist", "sneha.kulkarni@xyz.com", "Sneha", new DateTime(2026, 5, 26, 0, 0, 0, 0, DateTimeKind.Utc), "Kulkarni", "9876543213", 680000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Process Lead", "prakash.yadav@xyz.com", "Prakash", new DateTime(2025, 9, 7, 0, 0, 0, 0, DateTimeKind.Utc), "Yadav", "9876543214", 880000m, "Active", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Financial Analyst", "farah.ali@xyz.com", "Farah", new DateTime(2026, 8, 19, 0, 0, 0, 0, DateTimeKind.Utc), "Ali", "9876543215", 790000m, "Inactive", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Username",
                table: "AppUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}

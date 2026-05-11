# Employee Management System - Mini Project 2

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| **Name**    | Rakesh Singh                                 |
| **Batch**   | B2 - .NET Full Stack Development with Python |
| **Project** | Employee Management System - Mini Project 2  |

---

- .NET SDK 8.0+
- SQL Server 2022 (local)
- `dotnet-ef` CLI: `dotnet tool install --global dotnet-ef`
- Node.js 18+ (only needed for Jest tests)
- VS Code + Live Server extension

---

## How to Run

### Step 1 - Configure the database connection

Open `EMS.API/appsettings.json` and update the connection string if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EMSDashboard;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> For a named instance (e.g. SQLEXPRESS), change `Server=localhost` to
> `Server=localhost\SQLEXPRESS`

---

### Step 2 - Run EF Core migrations

Open **Package Manager Console** in Visual Studio and run:

```
Add-Migration InitialCreate
Update-Database
```

Or using the CLI from the `EMS.API` folder:

```bash
dotnet ef database update
```

This creates the `EMSDashboard` database, all tables, and seeds:

- 15 employee records
- 2 default user accounts:
    - `admin` / `admin123` → Admin (full CRUD)
    - `viewer` / `viewer123` → Viewer (read-only)

---

### Step 3 - Start the API

```bash
cd EMS.API
dotnet run
```

API runs at: `http://localhost:5000` Swagger UI: `http://localhost:5000/swagger`

---

### Step 4 - Open the Frontend

In VS Code, right-click `index.html` → **Open with Live Server** (port 5500).

Or open `index.html` directly in Chrome - I whitelisted both the origins in
CORS.

---

## Run Backend Tests

```bash
dotnet test EMS.Tests
```

Expected: **22 tests passed** (NUnit + Moq + EF In-Memory)

---

## Run Frontend Tests

```bash
npm install
npm test
```

Expected: **16 tests passed** (Jest)

---

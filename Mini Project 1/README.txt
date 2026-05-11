
# Employee Management System - Complete Project Explanation

## 1. What This Project Is

This is a browser-based Employee Management System built with:
- HTML5
- CSS3
- Bootstrap 5
- jQuery
- Vanilla JavaScript (modular IIFE services)
- Jest (unit testing)

It is a frontend-only project (no backend API, no database server).

All data starts from in-memory seed arrays in `js/data.js`, then services manage that data while the app is running.

## 2. Core Features

- Admin signup and login
- Dashboard with workforce summary cards
- Department-wise breakdown with percentages
- Recent employees list
- Employee CRUD operations:
	- Add employee
	- View details
	- Edit employee
	- Delete employee
- Search by name/email
- Filter by department and status
- Sort by name, salary, and join date
- Form validation with inline error messages
- Toast notifications for success/error flows

## 3. Project Structure

```
employee_management_system/
	index.html
	css/
		styles.css
	js/
		data.js
		storageService.js
		authService.js
		validationService.js
		employeeService.js
		dashboardService.js
		uiService.js
		app.js
	tests/
		testLoader.js
		authService.test.js
		employeeService.test.js
		dashboardService.test.js
	package.json
	jest.config.js
```

## 4. How The App Is Designed

### Layered service approach

1. `data.js`
	 - Contains initial mock admins and employees.

2. `storageService.js`
	 - Low-level in-memory store for employees.
	 - Provides safe CRUD-style primitives and `nextId()`.
	 - Returns cloned objects to avoid accidental outside mutation.

3. `employeeService.js`
	 - Business logic for employee data.
	 - Normalizes fields (trim, lowercase email, number salary).
	 - Provides add/update/remove/search/filter/sort utilities.

4. `dashboardService.js`
	 - Computes dashboard metrics from employee data.
	 - Total, active, inactive, departments, breakdown, recent employees.

5. `authService.js`
	 - Handles signup/login/logout with in-memory session state.
	 - Exposes `isLoggedIn()` and `getCurrentUser()`.

6. `validationService.js`
	 - Validates auth form and employee form inputs.
	 - Includes duplicate username and duplicate email checks.

7. `uiService.js`
	 - Renders table, dashboard, recent list, department breakdown.
	 - Manages Bootstrap modals and toasts.
	 - Shows/clears validation errors and populates form fields.

8. `app.js`
	 - Main controller and event wiring.
	 - Orchestrates navigation, state, service calls, and rendering.

## 5. HTML and UI Flow

`index.html` contains:
- Auth area:
	- Login view
	- Signup view
- Main application area:
	- Top navbar
	- Dashboard section
	- Employees section
- Modals:
	- Add/Edit Employee modal
	- View Employee modal
	- Delete confirmation modal
- Toast container for notifications

Scripts are loaded in dependency-safe order:
1. `data.js`
2. `storageService.js`
3. `authService.js`
4. `validationService.js`
5. `employeeService.js`
6. `dashboardService.js`
7. `uiService.js`
8. `app.js`

This order matters because some modules depend on symbols from earlier files.

## 6. Data Model

### Admin
```
{
	username: string,
	password: string
}
```

### Employee
```
{
	id: number,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	department: string,
	designation: string,
	salary: number,
	joinDate: string (YYYY-MM-DD),
	status: "Active" | "Inactive"
}
```

## 7. Authentication Behavior

- Default seeded admin exists in `data.js`:
	- Username: `admin`
	- Password: `admin123`
- Signup rules:
	- Username must be unique
	- Password must be at least 6 characters
- Login rules:
	- Username/password must match an admin
- Session behavior:
	- Logged-in user is stored only in runtime memory
	- Refreshing the page resets login/session

## 8. Employee Management Behavior

- Add:
	- Data normalized before storing
	- ID auto-generated using max ID + 1
- Edit:
	- Existing employee merged with updated fields
- Delete:
	- Remove by ID from in-memory store
- Search:
	- Case-insensitive name and email matching
- Filter:
	- Department and status filtering
- Sort:
	- Supports `name`, `salary`, `joinDate`, `department`, `email`
	- Direction can be asc/desc

## 9. Validation Rules

### Auth form
- Username required
- Password required
- Signup password minimum 6 characters
- Confirm password required and must match
- Duplicate username blocked

### Employee form
- First/last name required
- Valid email format required
- Email must be unique (except current record while editing)
- Phone must be exactly 10 digits
- Department/designation/status required
- Salary required and must be positive
- Join date required

## 10. Testing Setup

The project uses Jest with Node test environment.

`jest.config.js`:
- Runs tests from `tests/**/*.test.js`
- Collects coverage from `js/**/*.js`
- Excludes `js/data.js` and `js/app.js` from coverage
- Global coverage thresholds: 70% branches/functions/lines/statements

`tests/testLoader.js` loads browser-style service files into a Node VM context so they can be unit-tested without DOM.

### Current test scope

- `authService.test.js`
	- Signup duplicate username
	- Signup short password
	- Signup success
	- Login success/failure
	- Session state transitions

- `employeeService.test.js`
	- CRUD operations
	- Normalization and next ID logic
	- Search/filter/applyFilters
	- Sorting behavior

- `dashboardService.test.js`
	- Summary metrics
	- Department breakdown percentages
	- Recent employees logic

### Latest verified run

- Test Suites: 3 passed
- Tests: 16 passed

## 11. How To Run

From project root (`employee_management_system`):

```
npm install
npm test
```

Optional scripts:

```
npm run test:watch
npm run test:coverage
```

To run the app in browser:
- Open `index.html` directly in a browser, or
- Use a local static server (recommended for smoother development workflow)

## 12. Important Notes and Limitations

- No backend persistence: data resets on reload
- Passwords are plain text in seed/demo context only (not production-safe)
- Service files are globally scoped browser scripts, not ES modules
- Unit tests cover services, but not DOM rendering integration/end-to-end flows

## 13. Suggested Next Improvements

1. Persist employees/admins in LocalStorage or backend API.
2. Hash passwords and add secure auth flow.
3. Convert scripts to ES modules or TypeScript.
4. Add integration tests for UI rendering/events.
5. Add pagination and export (CSV/PDF) features.
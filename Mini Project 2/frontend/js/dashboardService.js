// dashboardService - provides dashboard summary, department breakdown, and recent employees
// in API mode, fetches from GET /api/employees/dashboard; in test mode, computes from local data
const dashboardService = (function () {
	const hasApi = () => typeof globalThis.API_BASE_URL === 'string' && typeof fetch === 'function';

	// get overall summary - total, active, inactive employees and department count
	function getSummary() {
		if (hasApi()) return storageService.getDashboard();
		const list = employeeService.getAll();
		const active = list.filter(employee => employee.status === 'Active').length;
		const inactive = list.filter(employee => employee.status === 'Inactive').length;
		const departments = new Set(list.map(employee => employee.department)).size;
		return { total: list.length, active, inactive, departments };
	}

	// get per-department employee count and percentage breakdown
	function getDepartmentBreakdown() {
		const list = employeeService.getAll();
		const total = list.length || 1;
		const grouped = {};
		list.forEach(employee => { grouped[employee.department] = (grouped[employee.department] || 0) + 1; });
		return Object.keys(grouped).sort().map(department => ({
			department,
			count: grouped[department],
			percentage: Math.round((grouped[department] / total) * 100)
		}));
	}

	// get the most recently added employees, sorted by ID (default 5)
	function getRecentEmployees(n) {
		return employeeService.getAll()
			.slice()
			.sort((left, right) => right.id - left.id)
			.slice(0, Number(n) || 5);
	}

	return { getSummary, getDepartmentBreakdown, getRecentEmployees };
})();

globalThis.dashboardService = dashboardService;

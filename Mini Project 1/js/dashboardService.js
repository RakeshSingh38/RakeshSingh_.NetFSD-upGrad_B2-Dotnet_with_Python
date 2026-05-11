const dashboardService = (function () {
	function getSummary() {
		const list = employeeService.getAll();
		const active      = list.filter(e => e.status === 'Active').length;
		const inactive    = list.filter(e => e.status === 'Inactive').length;
		const departments = new Set(list.map(e => e.department)).size;
		return { total: list.length, active, inactive, departments };
	}

	function getDepartmentBreakdown() {
		const list = employeeService.getAll();
		const total = list.length || 1;
		const grouped = {};
		list.forEach(e => { grouped[e.department] = (grouped[e.department] || 0) + 1; });
		return Object.keys(grouped).sort().map(department => ({
			department,
			count: grouped[department],
			percentage: Math.round((grouped[department] / total) * 100)
		}));
	}

	function getRecentEmployees(n) {
		return employeeService.getAll()
			.slice()
			.sort((a, b) => b.id - a.id)
			.slice(0, Number(n) || 5);
	}

	return { getSummary, getDepartmentBreakdown, getRecentEmployees };
})();

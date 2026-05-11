// employeeService - business logic layer for employee data
// delegates to storageService for data access; handles client-side filtering in test mode
const employeeService = (function () {
	const clone = value => JSON.parse(JSON.stringify(value));
	const hasApi = () => typeof globalThis.API_BASE_URL === 'string' && typeof fetch === 'function';

	function normalizeEmployee(data) {
		return {
			firstName: String(data.firstName || '').trim(),
			lastName: String(data.lastName || '').trim(),
			email: String(data.email || '').trim().toLowerCase(),
			phone: String(data.phone || '').trim(),
			department: String(data.department || '').trim(),
			designation: String(data.designation || '').trim(),
			salary: Number(data.salary),
			joinDate: String(data.joinDate || '').trim(),
			status: String(data.status || '').trim() || 'Active'
		};
	}

	function buildQueryString(query) {
		if (!query) return null;
		const params = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined && value !== null && String(value).trim() !== '') {
				params.set(key, value);
			}
		});
		return params.toString();
	}

	// get all employees - sends filters to server in API mode, applies them locally in test mode
	function getAll(query) {
		if (!hasApi()) {
			const list = clone(storageService.getAll());
			if (!query) return list;

			let filtered = list;
			filtered = search(query.search, filtered);
			filtered = filterByDepartment(query.department, filtered);
			filtered = filterByStatus(query.status, filtered);
			filtered = sortBy(query.sortBy || 'name', query.sortDir || 'asc', filtered);
			const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || globalThis.PAGE_SIZE || 10)));
			const page = Math.max(1, Number(query.page || 1));
			const totalCount = filtered.length;
			const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);
			const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
			const start = (currentPage - 1) * pageSize;
			return {
				data: filtered.slice(start, start + pageSize),
				totalCount,
				page: currentPage,
				pageSize,
				totalPages,
				hasNextPage: currentPage < totalPages,
				hasPrevPage: currentPage > 1
			};
		}
		return storageService.getAll(query || undefined);
	}

	// get a single employee by ID
	function getById(id) {
		return storageService.getById(id);
	}

	// add a new employee (normalizes field values before saving)
	function add(data) {
		return storageService.add(normalizeEmployee(data));
	}

	// update an existing employee by ID
	function update(id, data) {
		return storageService.update(id, normalizeEmployee(data));
	}

	// delete an employee by ID
	function remove(id) {
		return storageService.remove(id);
	}

	// search employees by name or email (case-insensitive)
	function search(query, source) {
		const list = source || getAll();
		const searchTerm = String(query || '').trim().toLowerCase();
		if (!searchTerm) return list;
		return list.filter(employee => {
			const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
			return fullName.includes(searchTerm) || String(employee.email || '').toLowerCase().includes(searchTerm);
		});
	}

	// filter employees by department (exact match)
	function filterByDepartment(department, source) {
		const list = source || getAll();
		const deptFilter = String(department || '').trim();
		return deptFilter ? list.filter(employee => employee.department === deptFilter) : list;
	}

	// filter employees by status (Active or Inactive)
	function filterByStatus(status, source) {
		const list = source || getAll();
		const statusFilter = String(status || '').trim();
		return statusFilter ? list.filter(employee => employee.status === statusFilter) : list;
	}

	// apply search, department, and status filters together
	function applyFilters(searchQuery, department, status) {
		let filtered = getAll();
		filtered = search(searchQuery, filtered);
		filtered = filterByDepartment(department, filtered);
		filtered = filterByStatus(status, filtered);
		return filtered;
	}

	// sort employees by field (name, salary, joinDate, department, email) and direction
	function sortBy(field, direction, source) {
		const list = (source || getAll()).slice();
		const sortMultiplier = direction === 'desc' ? -1 : 1;
		const comparator = {
			name: (a, b) => `${a.lastName} ${a.firstName}`.toLowerCase().localeCompare(`${b.lastName} ${b.firstName}`.toLowerCase()) * sortMultiplier,
			salary: (a, b) => (a.salary - b.salary) * sortMultiplier,
			joinDate: (a, b) => (new Date(a.joinDate) - new Date(b.joinDate)) * sortMultiplier,
			department: (a, b) => String(a.department || '').localeCompare(String(b.department || '')) * sortMultiplier,
			email: (a, b) => String(a.email || '').localeCompare(String(b.email || '')) * sortMultiplier
		};
		return comparator[field] ? list.sort(comparator[field]) : list;
	}

	// get the list of unique department names
	function getUniqueDepartments() {
		const departments = ["Engineering", "Marketing", "HR", "Finance", "Operations"];
		if (!hasApi()) {
			return Array.from(new Set(storageService.getAll().map(employee => employee.department))).sort();
		}
		return departments;
	}

	// check if an email is already taken by another employee (no-api mode only)
	function isEmailTaken(email, ignoreId) {
		const normalized = String(email || '').trim().toLowerCase();
		const ignored = ignoreId ? Number(ignoreId) : null;
		const list = !hasApi() ? storageService.getAll() : [];
		return list.some(employee => !(ignored && Number(employee.id) === ignored) && String(employee.email || '').toLowerCase() === normalized);
	}

	return { getAll, getById, add, update, remove, search, filterByDepartment, filterByStatus, applyFilters, sortBy, getUniqueDepartments, isEmailTaken };
})();

globalThis.employeeService = employeeService;

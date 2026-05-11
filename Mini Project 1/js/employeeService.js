const employeeService = (function () {
	function normalizeEmployee(data) {
		return {
			firstName:   String(data.firstName   || '').trim(),
			lastName:    String(data.lastName    || '').trim(),
			email:       String(data.email       || '').trim().toLowerCase(),
			phone:       String(data.phone       || '').trim(),
			department:  String(data.department  || '').trim(),
			designation: String(data.designation || '').trim(),
			salary:      Number(data.salary),
			joinDate:    String(data.joinDate    || '').trim(),
			status:      String(data.status      || '').trim() || 'Active'
		};
	}

	const getAll   = () => storageService.getAll();
	const getById  = id => storageService.getById(id);

	function add(data) {
		const payload = normalizeEmployee(data);
		payload.id = storageService.nextId();
		return storageService.add(payload);
	}

	function update(id, data) {
		return storageService.update(id, normalizeEmployee(data));
	}

	const remove = id => storageService.remove(id);

	function search(query, source) {
		const list = source || getAll();
		const q = String(query || '').trim().toLowerCase();
		if (!q) return list;
		return list.filter(e => {
			const fullName = (e.firstName + ' ' + e.lastName).toLowerCase();
			return fullName.includes(q) || e.email.toLowerCase().includes(q);
		});
	}

	function filterByDepartment(department, source) {
		const list = source || getAll();
		const dept = String(department || '').trim();
		return dept ? list.filter(e => e.department === dept) : list;
	}

	function filterByStatus(status, source) {
		const list = source || getAll();
		const st = String(status || '').trim();
		return st ? list.filter(e => e.status === st) : list;
	}

	function applyFilters(searchQuery, department, status) {
		let filtered = getAll();
		filtered = search(searchQuery, filtered);
		filtered = filterByDepartment(department, filtered);
		filtered = filterByStatus(status, filtered);
		return filtered;
	}

	function sortBy(field, direction, source) {
		const list = (source || getAll()).slice();
		const dir = direction === 'desc' ? -1 : 1;
		const comparator = {
			name:       (a, b) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare((b.lastName + ' ' + b.firstName).toLowerCase()) * dir,
			salary:     (a, b) => (a.salary - b.salary) * dir,
			joinDate:   (a, b) => (new Date(a.joinDate) - new Date(b.joinDate)) * dir,
			department: (a, b) => a.department.localeCompare(b.department) * dir,
			email:      (a, b) => a.email.localeCompare(b.email) * dir
		};
		return comparator[field] ? list.sort(comparator[field]) : list;
	}

	function getUniqueDepartments() {
		return Array.from(new Set(getAll().map(e => e.department))).sort();
	}

	function isEmailTaken(email, ignoreId) {
		const normalized = String(email || '').trim().toLowerCase();
		const ignored = ignoreId ? Number(ignoreId) : null;
		return getAll().some(e => !(ignored && e.id === ignored) && e.email.toLowerCase() === normalized);
	}

	return {
		getAll, getById, add, update, remove,
		search, filterByDepartment, filterByStatus,
		applyFilters, sortBy, getUniqueDepartments, isEmailTaken
	};
})();

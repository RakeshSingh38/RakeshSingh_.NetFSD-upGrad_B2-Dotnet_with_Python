// storageService - handles all data access for employee records
// calls the backend API when available, falls back to in-memory array for tests
const storageService = (function () {
	const root = globalThis;
	const clone = value => JSON.parse(JSON.stringify(value));
	const hasApi = () => typeof root.API_BASE_URL === 'string' && typeof fetch === 'function';

	let employeeStore = Array.isArray(root.employees) ? clone(root.employees) : [];

	function headers(includeAuth = true) {
		const requestHeaders = { 'Content-Type': 'application/json' };
		if (includeAuth && root.authService && typeof root.authService.getToken === 'function') {
			const token = root.authService.getToken();
			if (token) requestHeaders.Authorization = `Bearer ${token}`;
		}
		return requestHeaders;
	}

	async function request(path, options = {}) {
		const response = await fetch(`${root.API_BASE_URL}${path}`, {
			method: options.method || 'GET',
			headers: headers(options.auth !== false),
			body: options.body ? JSON.stringify(options.body) : undefined
		});

		const contentType = response.headers.get('content-type') || '';
		const payload = contentType.includes('application/json') ? await response.json() : null;

		if (!response.ok) {
			const error = new Error(payload?.message || response.statusText || 'Request failed');
			error.status = response.status;
			error.data = payload;
			throw error;
		}

		return payload;
	}

	// get all employees - forwards filters/pagination to API or returns in-memory list
	function getAll(query) {
		if (!hasApi()) return clone(employeeStore);
		const searchParams = new URLSearchParams();
		Object.entries(query || {}).forEach(([key, value]) => {
			if (value !== undefined && value !== null && String(value).trim() !== '') {
				searchParams.set(key, value);
			}
		});
		const suffix = searchParams.toString();
		return request(`/employees${suffix ? `?${suffix}` : ''}`);
	}

	// get a single employee by ID
	function getById(id) {
		if (!hasApi()) {
			const employee = employeeStore.find(item => item.id === Number(id));
			return employee ? clone(employee) : null;
		}
		return request(`/employees/${Number(id)}`);
	}

	// add a new employee record
	function add(employee) {
		if (!hasApi()) {
			const payload = { ...employee, id: nextId() };
			employeeStore.push(clone(payload));
			return clone(payload);
		}
		const payload = { ...employee };
		delete payload.id;
		return request('/employees', { method: 'POST', body: payload });
	}

	// update an existing employee by ID
	function update(id, data) {
		if (!hasApi()) {
			const numericId = Number(id);
			const index = employeeStore.findIndex(item => item.id === numericId);
			if (index === -1) return null;
			employeeStore[index] = { ...employeeStore[index], ...data, id: numericId };
			return clone(employeeStore[index]);
		}
		return request(`/employees/${Number(id)}`, { method: 'PUT', body: data });
	}

	// delete an employee by ID
	function remove(id) {
		if (!hasApi()) {
			const index = employeeStore.findIndex(item => item.id === Number(id));
			if (index === -1) return null;
			return clone(employeeStore.splice(index, 1)[0]);
		}
		return request(`/employees/${Number(id)}`, { method: 'DELETE' });
	}

	function nextId() {
		return employeeStore.length === 0 ? 1 : Math.max(...employeeStore.map(emp => Number(emp.id) || 0)) + 1;
	}

	// get dashboard KPIs and recent employees from the API
	function getDashboard() {
		return request('/employees/dashboard');
	}

	return { getAll, getById, add, update, remove, nextId, getDashboard };
})();

globalThis.storageService = storageService;

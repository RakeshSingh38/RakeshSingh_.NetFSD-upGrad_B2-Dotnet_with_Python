const storageService = (function () {
	let employeeStore = employees.map(emp => ({ ...emp }));

	function getAll() {
		return employeeStore.map(emp => ({ ...emp }));
	}

	function getById(id) {
		const numericId = Number(id);
		const employee = employeeStore.find(item => item.id === numericId);
		return employee ? { ...employee } : null;
	}

	function add(employee) {
		employeeStore.push({ ...employee });
		return { ...employee };
	}

	function update(id, data) {
		const numericId = Number(id);
		const index = employeeStore.findIndex(item => item.id === numericId);
		if (index === -1) return null;
		employeeStore[index] = { ...employeeStore[index], ...data, id: numericId };
		return { ...employeeStore[index] };
	}

	function remove(id) {
		const numericId = Number(id);
		const index = employeeStore.findIndex(item => item.id === numericId);
		if (index === -1) return null;
		return { ...employeeStore.splice(index, 1)[0] };
	}

	function nextId() {
		return employeeStore.length === 0 ? 1 : Math.max(...employeeStore.map(emp => emp.id)) + 1;
	}

	return { getAll, getById, add, update, remove, nextId };
})();

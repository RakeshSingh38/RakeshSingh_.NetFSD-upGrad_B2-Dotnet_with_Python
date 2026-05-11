// uiService - handles all DOM rendering and UI interactions
// renders the employee table, dashboard cards, modals, toasts, and role-based visibility
const uiService = (function () {
	let employeeModal = null;
	let viewModal = null;
	let deleteModal = null;

	const DEPT_THEME = {
		Engineering: ['text-bg-primary', 'bg-primary'],
		Marketing: ['text-bg-warning', 'bg-warning'],
		HR: ['text-bg-info', 'bg-info'],
		Finance: ['text-bg-success', 'bg-success'],
		Operations: ['text-bg-secondary', 'bg-secondary']
	};

	const EMPLOYEE_FIELD_MAP = {
		firstName: '#employeeFirstName',
		lastName: '#employeeLastName',
		email: '#employeeEmail',
		phone: '#employeePhone',
		department: '#employeeDepartment',
		designation: '#employeeDesignation',
		salary: '#employeeSalary',
		joinDate: '#employeeJoinDate',
		status: '#employeeStatus'
	};

	const AUTH_FIELD_MAP = {
		username: ['#loginUsername, #signupUsername', '#loginUsername-error, #signupUsername-error'],
		password: ['#loginPassword, #signupPassword', '#loginPassword-error, #signupPassword-error'],
		confirmPassword: ['#signupConfirm', '#signupConfirm-error']
	};

	function ensureModals() {
		if (!employeeModal) employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
		if (!viewModal) viewModal = new bootstrap.Modal(document.getElementById('viewEmployeeModal'));
		if (!deleteModal) deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
	}

	function formatDate(value) {
		const stringValue = String(value || '');
		return stringValue.length >= 10 ? stringValue.slice(0, 10) : stringValue;
	}

	function isAdmin() {
		return typeof authService !== 'undefined' && typeof authService.isAdmin === 'function' && authService.isAdmin();
	}

	const getDeptBadgeClass = dept => (DEPT_THEME[dept] || ['text-bg-light'])[0];
	const getDeptProgressClass = dept => (DEPT_THEME[dept] || ['', 'bg-primary'])[1];
	const getStatusBadgeClass = status => status === 'Active' ? 'badge-active' : 'badge-inactive';

	// render the employee table body and update the pagination bar
	function renderEmployeeTable(employeeList) {
		const $body = $('#employeeTableBody');
		const rows = Array.isArray(employeeList) ? employeeList : (employeeList?.data || []);
		if (!rows.length) {
			$body.html('<tr><td colspan="9" class="text-center text-secondary py-4">No employees found</td></tr>');
			$('#employeeCountText').text('Showing 0 of 0 employees');
			renderPagination(employeeList);
			return;
		}
		const canEdit = isAdmin();
		$body.html(rows.map(({ id, firstName, lastName, email, department, designation, salary, joinDate, status }) => `
			<tr>
				<td>${id}</td>
				<td class="fw-semibold">${firstName} ${lastName}</td>
				<td>${email}</td>
				<td><span class="badge ${getDeptBadgeClass(department)}">${department}</span></td>
				<td>${designation}</td>
				<td>${formatCurrency(salary)}</td>
				<td>${formatDate(joinDate)}</td>
				<td><span class="badge ${getStatusBadgeClass(status)}">${status}</span></td>
				<td>
					<button type="button" class="btn btn-sm btn-outline-primary me-1 js-view-employee"   data-id="${id}"><i class="bi bi-eye"></i></button>
					${canEdit ? `<button type="button" class="btn btn-sm btn-outline-warning me-1 js-edit-employee"   data-id="${id}"><i class="bi bi-pencil"></i></button>` : ''}
					${canEdit ? `<button type="button" class="btn btn-sm btn-outline-danger    js-delete-employee"   data-id="${id}"><i class="bi bi-trash"></i></button>` : ''}
				</td>
			</tr>`).join(''));
		if (employeeList && typeof employeeList.totalCount === 'number') {
			const start = employeeList.totalCount === 0 ? 0 : ((employeeList.page - 1) * employeeList.pageSize) + 1;
			const end = employeeList.totalCount === 0 ? 0 : Math.min(employeeList.page * employeeList.pageSize, employeeList.totalCount);
			$('#employeeCountText').text(`Showing ${start}–${end} of ${employeeList.totalCount} employees`);
			renderPagination(employeeList);
		} else {
			$('#employeeCountText').text(`Showing ${rows.length} employees`);
			renderPagination(null);
		}
	}

	// update the KPI cards on the dashboard (total, active, inactive, departments)
	function renderDashboardCards(data) {
		$('#totalEmployees').text(data.totalEmployees ?? data.total ?? 0);
		$('#activeEmployees').text(data.activeEmployees ?? data.active ?? 0);
		$('#inactiveEmployees').text(data.inactiveEmployees ?? data.inactive ?? 0);
		$('#departmentCount').text(data.totalDepartments ?? data.departments ?? 0);
	}

	// render the department breakdown table with employee counts and progress bars
	function renderDepartmentBreakdown(rows) {
		const $container = $('#departmentBreakdownContainer');
		const list = Array.isArray(rows) ? rows : (rows?.departmentBreakdown || []);
		if (!list.length) {
			$container.html('<p class="text-secondary mb-0">No data available.</p>');
			return;
		}
		const body = list.map(({ department, count, percentage }) => `
			<tr>
				<td><span class="badge ${getDeptBadgeClass(department)}">${department}</span></td>
				<td class="fw-semibold">${count}</td>
				<td><div class="progress" style="height:8px;"><div class="progress-bar ${getDeptProgressClass(department)}" role="progressbar" style="width:${percentage}%;"></div></div></td>
				<td>${percentage}%</td>
			</tr>`).join('');
		$container.html(`<div class="table-responsive"><table class="table table-sm align-middle mb-0"><thead><tr><th>Department</th><th>Count</th><th>Distribution</th><th>%</th></tr></thead><tbody>${body}</tbody></table></div>`);
	}

	// render the recent employees list on the dashboard
	function renderRecentEmployees(employeeList) {
		const $container = $('#recentEmployeesContainer');
		const list = Array.isArray(employeeList) ? employeeList : (employeeList?.recentEmployees || []);
		if (!list.length) {
			$container.html('<p class="text-secondary mb-0">No recent employees.</p>');
			return;
		}
		const markup = list.map(({ firstName, lastName, designation, department, status }) => {
			const initials = (firstName[0] || '') + (lastName[0] || '');
			return `
				<div class="d-flex align-items-center justify-content-between recent-item">
					<div class="d-flex align-items-center gap-2">
						<span class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center recent-avatar">${initials}</span>
						<div>
							<div class="fw-semibold small recent-name">${firstName} ${lastName}</div>
							<div class="text-secondary small recent-role">${designation}</div>
						</div>
					</div>
					<div class="d-flex gap-1">
						<span class="badge ${getDeptBadgeClass(department)}">${department}</span>
						<span class="badge ${getStatusBadgeClass(status)}">${status}</span>
					</div>
				</div>`;
		}).join('');
		$container.html(`<div class="d-flex flex-column gap-2">${markup}</div>`);
	}

	function clearForm() {
		$('#employeeForm')[0].reset();
		$('#employeeId').val('');
		$('#employeeForm .is-invalid').removeClass('is-invalid');
		$('#employeeForm .invalid-feedback').text('');
		$('#employeeModalLabel').text('Add Employee');
		$('#submitEmployeeBtn').text('Save Employee');
	}

	function populateForm(employee) {
		$('#employeeId').val(employee.id);
		Object.entries(EMPLOYEE_FIELD_MAP).forEach(([key, selector]) => {
			const value = key === 'joinDate' ? formatDate(employee[key]) : employee[key];
			$(selector).val(value);
		});
		$('#employeeModalLabel').text('Edit Employee');
		$('#submitEmployeeBtn').text('Update Employee');
	}

	function showInlineErrors(errors) {
		$('#employeeForm .is-invalid').removeClass('is-invalid');
		$('#employeeForm .invalid-feedback').text('');
		Object.entries(errors).forEach(([key, msg]) => {
			const selector = EMPLOYEE_FIELD_MAP[key];
			if (!selector) return;
			$(selector).addClass('is-invalid');
			$(`#employee${key.charAt(0).toUpperCase() + key.slice(1)}-error`).text(msg);
		});
	}

	function clearAuthErrors(formSelector) {
		const $form = $(formSelector);
		$form.find('.form-control').removeClass('is-invalid');
		$form.find('.invalid-feedback').text('');
	}

	function showAuthErrors(formSelector, errors) {
		const $form = $(formSelector);
		Object.entries(errors).forEach(([key, msg]) => {
			const map = AUTH_FIELD_MAP[key];
			if (!map) return;
			$form.find(map[0]).addClass('is-invalid');
			$form.find(map[1]).text(msg);
		});
	}

	function renderViewEmployee(data) {
		const fields = [
			['Name', `${data.firstName} ${data.lastName}`],
			['Email', data.email],
			['Phone', data.phone],
			['Department', data.department],
			['Designation', data.designation],
			['Salary', formatCurrency(data.salary)],
			['Join Date', formatDate(data.joinDate)],
			['Status', `<span class="badge ${getStatusBadgeClass(data.status)}">${data.status}</span>`]
		];
		const content = `<div class="row g-3">${fields.map(([label, val]) =>
			`<div class="col-md-6"><strong>${label}:</strong><br>${val}</div>`).join('')}</div>`;
		$('#viewEmployeeContent').html(content);
		$('#editEmployeeBtn').data('id', data.id);
	}

	// open a modal by type: 'add', 'edit', 'view', or 'delete'
	function showModal(type, data) {
		ensureModals();
		const actions = {
			add: () => { clearForm(); employeeModal.show(); },
			edit: () => { clearForm(); populateForm(data); employeeModal.show(); },
			view: () => { renderViewEmployee(data); viewModal.show(); },
			delete: () => {
				$('#deleteEmployeeName').text(`${data.firstName} ${data.lastName}`);
				$('#confirmDeleteBtn').data('id', data.id);
				deleteModal.show();
			}
		};
		if (actions[type]) actions[type]();
	}

	// hide a modal by type: 'employee', 'view', or 'delete'
	function hideModal(type) {
		ensureModals();
		const map = { employee: employeeModal, view: viewModal, delete: deleteModal };
		if (map[type]) map[type].hide();
	}

	// show a toast notification (type: 'success', 'error', or 'info')
	function showToast(message, type) {
		const toastId = 'toast-' + Date.now();
		const bgClass = type === 'error' ? 'text-bg-danger' : type === 'success' ? 'text-bg-success' : 'text-bg-primary';
		const toastHtml = `<div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
		$('#toastContainer').append(toastHtml);
		const toastEl = document.getElementById(toastId);
		const toast = new bootstrap.Toast(toastEl, { delay: 2200 });
		toast.show();
		toastEl.addEventListener('hidden.bs.toast', function () { $(this).remove(); });
	}

	// populate the department filter dropdown
	function populateDepartmentFilter(departments) {
		const $select = $('#departmentFilter');
		const current = $select.val();
		$select.html(`<option value="">All Departments</option>${departments.map(d => `<option value="${d}">${d}</option>`).join('')}`);
		if (current) $select.val(current);
	}

	function renderPagination(pageResult) {
		const $container = $('#employeePagination');
		if (!pageResult || typeof pageResult.totalCount !== 'number') {
			$container.empty();
			return;
		}

		const totalPages = pageResult.totalPages || 0;
		if (!totalPages || totalPages <= 1) {
			$container.empty();
			return;
		}

		const currentPage = pageResult.page || 1;
		const items = [];
		items.push(`<li class="page-item ${currentPage <= 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${Math.max(1, currentPage - 1)}">Prev</a></li>`);
		for (let page = 1; page <= totalPages; page += 1) {
			items.push(`<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`);
		}
		items.push(`<li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${Math.min(totalPages, currentPage + 1)}">Next</a></li>`);
		$container.html(`<nav aria-label="Employee pagination"><ul class="pagination pagination-sm justify-content-center mb-0">${items.join('')}</ul></nav>`);
	}

	// show/hide Admin-only buttons and the viewer notice based on current user role
	function applyRoleUI() {
		const admin = isAdmin();
		const loggedIn = typeof authService !== 'undefined' && typeof authService.isLoggedIn === 'function' && authService.isLoggedIn();
		$('#addEmployeeBtn, #addEmployeeBtnTop').toggleClass('d-none', !admin);
		$('#viewerNotice').toggleClass('d-none', admin);
		$('#currentRoleBadge').toggleClass('d-none', !loggedIn);
		$('#currentRoleBadge').toggleClass('text-bg-success', admin).toggleClass('text-bg-warning', !admin).text(admin ? 'Admin' : 'Viewer');
	}

	return {
		renderEmployeeTable, renderDashboardCards, renderDepartmentBreakdown,
		renderRecentEmployees, showModal, hideModal, populateForm, showToast,
		showInlineErrors, clearForm, clearAuthErrors, showAuthErrors,
		populateDepartmentFilter, renderPagination, applyRoleUI, formatCurrency, formatDate
	};
})();

globalThis.uiService = uiService;

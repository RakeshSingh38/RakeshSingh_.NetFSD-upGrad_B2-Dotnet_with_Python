$(function () {
    const uiState = { search: '', department: '', status: '', sortField: '', sortDirection: 'asc' };

    const ensureAuthAccess = () => {
        if (!authService.isLoggedIn()) { showLoginView(); return false; }
        return true;
    };

    function showLoginView() {
        $('#appContainer').addClass('d-none');
        $('#authContainer').removeClass('d-none');
        $('#signupView').addClass('d-none');
        $('#loginView').removeClass('d-none');
    }

    const showSignupView = () => {
        $('#loginView').addClass('d-none');
        $('#signupView').removeClass('d-none');
    };

    function showDashboardView() {
        if (!ensureAuthAccess()) return;
        $('#authContainer').addClass('d-none');
        $('#appContainer').removeClass('d-none');
        $('#employeeView').addClass('d-none');
        $('#dashboardView').removeClass('d-none');
        $('#navEmployees').removeClass('active');
        $('#navDashboard').addClass('active');
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.username)
            $('#currentUserBadge').html(`<i class="bi bi-person-circle me-1"></i>${currentUser.username}`);
        renderDashboard();
    }

    function showEmployeeView() {
        if (!ensureAuthAccess()) return;
        $('#authContainer').addClass('d-none');
        $('#appContainer').removeClass('d-none');
        $('#dashboardView').addClass('d-none');
        $('#employeeView').removeClass('d-none');
        $('#navDashboard').removeClass('active');
        $('#navEmployees').addClass('active');
        refreshEmployeeList();
    }

    function renderDashboard() {
        uiService.renderDashboardCards(dashboardService.getSummary());
        uiService.renderDepartmentBreakdown(dashboardService.getDepartmentBreakdown());
        uiService.renderRecentEmployees(dashboardService.getRecentEmployees(5));
    }

    function refreshEmployeeList() {
        let list = employeeService.applyFilters(uiState.search, uiState.department, uiState.status);
        const total = employeeService.getAll().length;
        if (uiState.sortField) list = employeeService.sortBy(uiState.sortField, uiState.sortDirection, list);
        uiService.renderEmployeeTable(list);
        uiService.populateDepartmentFilter(employeeService.getUniqueDepartments());
        $('#employeeCountText').text(`Showing ${list.length} of ${total} employees`);
        updateSortIndicators();
    }

    const refreshAllViews = () => { renderDashboard(); refreshEmployeeList(); };

    function getEmployeePayloadFromForm() {
        return {
            id:          $('#employeeId').val()          || null,
            firstName:   $('#employeeFirstName').val(),
            lastName:    $('#employeeLastName').val(),
            email:       $('#employeeEmail').val(),
            phone:       $('#employeePhone').val(),
            department:  $('#employeeDepartment').val(),
            designation: $('#employeeDesignation').val(),
            salary:      $('#employeeSalary').val(),
            joinDate:    $('#employeeJoinDate').val(),
            status:      $('#employeeStatus').val()
        };
    }

    function updateSortIndicators() {
        $('.sort-indicator').text('↕');
        if (!uiState.sortField) return;
        $(`.sort-indicator[data-for="${uiState.sortField}"]`).text(uiState.sortDirection === 'asc' ? '▲' : '▼');
    }

    function toggleSort(field) {
        if (uiState.sortField === field)
            uiState.sortDirection = uiState.sortDirection === 'asc' ? 'desc' : 'asc';
        else {
            uiState.sortField = field;
            uiState.sortDirection = field === 'joinDate' ? 'desc' : 'asc';
        }
        refreshEmployeeList();
    }

    authService.isLoggedIn() ? showDashboardView() : showLoginView();

    $('#showSignup').on('click', e => { e.preventDefault(); uiService.clearAuthErrors('#signupForm'); showSignupView(); });
    $('#showLogin').on('click',  e => { e.preventDefault(); uiService.clearAuthErrors('#loginForm');  showLoginView(); });

    $('#signupForm').on('submit', e => {
        e.preventDefault();
        uiService.clearAuthErrors('#signupForm');
        const payload = { mode: 'signup', username: $('#signupUsername').val(), password: $('#signupPassword').val(), confirmPassword: $('#signupConfirm').val() };
        const errors = validationService.validateAuthForm(payload);
        if (Object.keys(errors).length) { uiService.showAuthErrors('#signupForm', errors); return; }
        const result = authService.signup(String(payload.username).trim(), payload.password);
        if (!result.success) { uiService.showAuthErrors('#signupForm', { username: result.message }); return; }
        uiService.showToast(result.message, 'success');
        $('#signupForm')[0].reset();
        showLoginView();
    });

    $('#loginForm').on('submit', e => {
        e.preventDefault();
        uiService.clearAuthErrors('#loginForm');
        const payload = { mode: 'login', username: $('#loginUsername').val(), password: $('#loginPassword').val() };
        const errors = validationService.validateAuthForm(payload);
        if (Object.keys(errors).length) { uiService.showAuthErrors('#loginForm', errors); return; }
        const result = authService.login(String(payload.username).trim(), payload.password);
        if (!result.success) { uiService.showAuthErrors('#loginForm', { username: result.message, password: result.message }); return; }
        uiService.showToast('Login successful.', 'success');
        showDashboardView();
    });

    $('#logoutBtn').on('click', () => {
        authService.logout();
        uiService.showToast('Logged out successfully.', 'success');
        $('#loginForm')[0].reset();
        $('#signupForm')[0].reset();
        showLoginView();
    });

    $('#navDashboard').on('click', e => { e.preventDefault(); showDashboardView(); });
    $('#navEmployees').on('click', e => { e.preventDefault(); showEmployeeView(); });

    $('#addEmployeeBtn, #addEmployeeBtnTop').on('click', () => { if (ensureAuthAccess()) uiService.showModal('add'); });

    $('#employeeForm').on('submit', e => {
        e.preventDefault();
        const formData = getEmployeePayloadFromForm();
        const errors = validationService.validateEmployeeForm(formData);
        if (Object.keys(errors).length) { uiService.showInlineErrors(errors); return; }
        if (formData.id) {
            employeeService.update(formData.id, formData);
            uiService.showToast('Employee updated successfully.', 'success');
        } else {
            employeeService.add(formData);
            uiService.showToast('Employee added successfully.', 'success');
        }
        uiService.hideModal('employee');
        uiService.clearForm();
        refreshAllViews();
    });

    $('#employeeTableBody').on('click', '.js-view-employee, .js-edit-employee, .js-delete-employee', function () {
        const employee = employeeService.getById($(this).data('id'));
        if (!employee) return;
        if ($(this).hasClass('js-view-employee'))   uiService.showModal('view',   employee);
        if ($(this).hasClass('js-edit-employee'))   uiService.showModal('edit',   employee);
        if ($(this).hasClass('js-delete-employee')) uiService.showModal('delete', employee);
    });

    $('#editEmployeeBtn').on('click', function () {
        const employee = employeeService.getById($(this).data('id'));
        if (employee) { uiService.hideModal('view'); uiService.showModal('edit', employee); }
    });

    $('#confirmDeleteBtn').on('click', function () {
        if (employeeService.remove($(this).data('id'))) {
            uiService.showToast('Employee deleted successfully.', 'success');
            uiService.hideModal('delete');
            refreshAllViews();
        }
    });

    $('#searchInput').on('input',    function () { uiState.search     = $(this).val(); refreshEmployeeList(); });
    $('#departmentFilter').on('change', function () { uiState.department = $(this).val(); refreshEmployeeList(); });
    $('input[name="statusFilter"]').on('change', function () {
        uiState.status = $(this).val();
        $('#statusFilter').val(uiState.status);
        refreshEmployeeList();
    });

    $('#employeeTable thead').on('click', '.sort-trigger', function () { toggleSort($(this).data('sort-field')); });
});

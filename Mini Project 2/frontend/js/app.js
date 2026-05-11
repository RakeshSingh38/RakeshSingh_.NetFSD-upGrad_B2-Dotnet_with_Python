$(function () {
    const uiState = { search: '', department: '', status: '', sortBy: 'name', sortDir: 'asc', page: 1, pageSize: PAGE_SIZE };
    let searchTimer = null;

    const ensureAuthAccess = () => {
        if (!authService.isLoggedIn()) { showLoginView(); return false; }
        return true;
    };

    function showLoginView() {
        $('#appContainer').addClass('d-none');
        $('#authContainer').removeClass('d-none');
        $('#signupView').addClass('d-none');
        $('#loginView').removeClass('d-none');
        uiService.applyRoleUI();
    }

    const showSignupView = () => {
        $('#loginView').addClass('d-none');
        $('#signupView').removeClass('d-none');
    };

    async function showDashboardView() {
        if (!ensureAuthAccess()) return;
        $('#authContainer').addClass('d-none');
        $('#appContainer').removeClass('d-none');
        $('#employeeView').addClass('d-none');
        $('#dashboardView').removeClass('d-none');
        $('#navEmployees').removeClass('active');
        $('#navDashboard').addClass('active');
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.username) {
            $('#currentUserBadge').html(`<i class="bi bi-person-circle me-1"></i>${currentUser.username}`);
        }
        uiService.applyRoleUI();
        await renderDashboard();
    }

    async function showEmployeeView() {
        if (!ensureAuthAccess()) return;
        $('#authContainer').addClass('d-none');
        $('#appContainer').removeClass('d-none');
        $('#dashboardView').addClass('d-none');
        $('#employeeView').removeClass('d-none');
        $('#navDashboard').removeClass('active');
        $('#navEmployees').addClass('active');
        uiService.applyRoleUI();
        await refreshEmployeeList();
    }

    const renderDashboard = async () => {
        const summary = await dashboardService.getSummary();
        uiService.renderDashboardCards(summary);
        uiService.renderDepartmentBreakdown(summary);
        uiService.renderRecentEmployees(summary);
    }

    async function refreshEmployeeList() {
        const result = await employeeService.getAll(uiState);
        const pageData = Array.isArray(result) ? { data: result, totalCount: result.length, page: 1, pageSize: result.length || uiState.pageSize, totalPages: result.length ? 1 : 0, hasNextPage: false, hasPrevPage: false } : result;
        uiState.page = pageData.page || 1;
        uiState.pageSize = pageData.pageSize || uiState.pageSize;
        uiService.renderEmployeeTable(pageData);
        uiService.populateDepartmentFilter(employeeService.getUniqueDepartments());
        updateSortIndicators();
    }

    async function refreshAllViews() {
        await renderDashboard();
        await refreshEmployeeList();
    }

    function getEmployeePayloadFromForm() {
        return {
            id: $('#employeeId').val() || null,
            firstName: $('#employeeFirstName').val(),
            lastName: $('#employeeLastName').val(),
            email: $('#employeeEmail').val(),
            phone: $('#employeePhone').val(),
            department: $('#employeeDepartment').val(),
            designation: $('#employeeDesignation').val(),
            salary: $('#employeeSalary').val(),
            joinDate: $('#employeeJoinDate').val(),
            status: $('#employeeStatus').val()
        };
    }

    function updateSortIndicators() {
        $('.sort-indicator').text('↕');
        if (!uiState.sortBy) return;
        $(`.sort-indicator[data-for="${uiState.sortBy}"]`).text(uiState.sortDir === 'asc' ? '▲' : '▼');
    }

    function toggleSort(field) {
        if (uiState.sortBy === field)
            uiState.sortDir = uiState.sortDir === 'asc' ? 'desc' : 'asc';
        else {
            uiState.sortBy = field;
            uiState.sortDir = field === 'joinDate' ? 'desc' : 'asc';
        }
        uiState.page = 1;
        refreshEmployeeList();
    }

    authService.isLoggedIn() ? showDashboardView() : showLoginView();

    $('#showSignup').on('click', e => { e.preventDefault(); uiService.clearAuthErrors('#signupForm'); showSignupView(); });
    $('#showLogin').on('click',  e => { e.preventDefault(); uiService.clearAuthErrors('#loginForm');  showLoginView(); });

    $('#signupForm').on('submit', async e => {
        e.preventDefault();
        uiService.clearAuthErrors('#signupForm');
        const payload = { mode: 'signup', username: $('#signupUsername').val(), password: $('#signupPassword').val(), confirmPassword: $('#signupConfirm').val() };
        const errors = validationService.validateAuthForm(payload);
        if (Object.keys(errors).length) { uiService.showAuthErrors('#signupForm', errors); return; }
        const result = await authService.signup(String(payload.username).trim(), payload.password, 'Admin');
        if (!result.success) { uiService.showAuthErrors('#signupForm', validationService.mapServerErrors(result)); return; }
        uiService.showToast(result.message, 'success');
        $('#signupForm')[0].reset();
        showLoginView();
    });

    $('#loginForm').on('submit', async e => {
        e.preventDefault();
        uiService.clearAuthErrors('#loginForm');
        const payload = { mode: 'login', username: $('#loginUsername').val(), password: $('#loginPassword').val() };
        const errors = validationService.validateAuthForm(payload);
        if (Object.keys(errors).length) { uiService.showAuthErrors('#loginForm', errors); return; }
        const result = await authService.login(String(payload.username).trim(), payload.password);
        if (!result.success) { uiService.showAuthErrors('#loginForm', validationService.mapServerErrors(result)); return; }
        uiService.showToast('Login successful.', 'success');
        uiService.applyRoleUI();
        await showDashboardView();
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

    $('#employeeForm').on('submit', async e => {
        e.preventDefault();
        const formData = getEmployeePayloadFromForm();
        const errors = validationService.validateEmployeeForm(formData);
        if (Object.keys(errors).length) { uiService.showInlineErrors(errors); return; }
        try {
            if (formData.id) {
                await employeeService.update(formData.id, formData);
                uiService.showToast('Employee updated successfully.', 'success');
            } else {
                await employeeService.add(formData);
                uiService.showToast('Employee added successfully.', 'success');
            }
            uiService.hideModal('employee');
            uiService.clearForm();
            await refreshAllViews();
        } catch (error) {
            const mapped = validationService.mapServerErrors(error);
            uiService.showInlineErrors(mapped);
        }
    });

    $('#employeeTableBody').on('click', '.js-view-employee, .js-edit-employee, .js-delete-employee', async function () {
        const employee = await employeeService.getById($(this).data('id'));
        if (!employee) return;
        const action = ['view', 'edit', 'delete'].find(t => $(this).hasClass(`js-${t}-employee`));
        if (action) uiService.showModal(action, employee);
    });

    $('#editEmployeeBtn').on('click', async function () {
        const employee = await employeeService.getById($(this).data('id'));
        if (employee) { uiService.hideModal('view'); uiService.showModal('edit', employee); }
    });

    $('#confirmDeleteBtn').on('click', async function () {
        try {
            await employeeService.remove($(this).data('id'));
            uiService.showToast('Employee deleted successfully.', 'success');
            uiService.hideModal('delete');
            await refreshAllViews();
        } catch (error) {
            uiService.showToast(validationService.mapServerErrors(error).email || error.message || 'Delete failed.', 'error');
        }
    });

    $('#searchInput').on('input', function () {
        clearTimeout(searchTimer);
        uiState.search = $(this).val();
        uiState.page = 1;
        searchTimer = setTimeout(() => refreshEmployeeList(), 350);
    });

    $('#departmentFilter').on('change', function () { uiState.department = $(this).val(); uiState.page = 1; refreshEmployeeList(); });
    $('input[name="statusFilter"]').on('change', function () {
        uiState.status = $(this).val();
        $('#statusFilter').val(uiState.status);
        uiState.page = 1;
        refreshEmployeeList();
    });

    $('#employeeTable thead').on('click', '.sort-trigger', function () { toggleSort($(this).data('sort-field')); });

    $('#employeePagination').on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = Number($(this).data('page'));
        if (!page || page === uiState.page) return;
        uiState.page = page;
        refreshEmployeeList();
    });

    uiService.applyRoleUI();
});

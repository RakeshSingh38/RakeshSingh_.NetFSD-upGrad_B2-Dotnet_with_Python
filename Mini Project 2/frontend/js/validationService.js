// validationService - client-side form validation for login, signup, and employee forms
// also maps API error responses to field-level errors for inline display
const validationService = (function () {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\d{10}$/;
	const hasApi = () => typeof globalThis.API_BASE_URL === 'string';

	// validate the login or signup form fields
	function validateAuthForm(formData) {
		const errors = {};
		const { mode } = formData;
		const username = (formData.username || '').trim();
		const password = formData.password || '';
		const confirmPassword = formData.confirmPassword || '';

		if (!username) errors.username = 'Username is required.';
		if (!password) errors.password = 'Password is required.';

		if (mode === 'signup') {
			if (password && password.length < 6) {
				errors.password = 'Password must be at least 6 characters.';
			}
			if (!confirmPassword) {
				errors.confirmPassword = 'Confirm Password is required.';
			} else if (password !== confirmPassword) {
				errors.confirmPassword = 'Passwords do not match.';
			}
			if (!hasApi() && !errors.username && Array.isArray(globalThis.admins) && globalThis.admins.some(admin => admin.username.toLowerCase() === username.toLowerCase())) {
				errors.username = 'Username already exists.';
			}
		}
		return errors;
	}

	// validate the employee add/edit form - returns an object with field errors
	function validateEmployeeForm(formData) {
		const errors = {};
		const firstName = String(formData.firstName || '').trim();
		const lastName = String(formData.lastName || '').trim();
		const email = String(formData.email || '').trim().toLowerCase();
		const phone = String(formData.phone || '').trim();
		const department = String(formData.department || '').trim();
		const designation = String(formData.designation || '').trim();
		const salary = Number(formData.salary);
		const joinDate = String(formData.joinDate || '').trim();
		const status = String(formData.status || '').trim();

		if (!firstName) errors.firstName = 'First Name is required.';
		if (!lastName) errors.lastName = 'Last Name is required.';
		if (!email) errors.email = 'Email is required.';
		else if (!emailRegex.test(email)) errors.email = 'Invalid email format.';
		else if (!hasApi() && employeeService.isEmailTaken(email, formData.id)) errors.email = 'Email already exists.';
		if (!phone) errors.phone = 'Phone is required.';
		else if (!phoneRegex.test(phone)) errors.phone = 'Phone must be 10 digits.';
		if (!department) errors.department = 'Department is required.';
		if (!designation) errors.designation = 'Designation is required.';
		if (!formData.salary && formData.salary !== 0) errors.salary = 'Salary is required.';
		else if (Number.isNaN(salary) || salary <= 0) errors.salary = 'Salary must be a positive number.';
		if (!joinDate) errors.joinDate = 'Join Date is required.';
		if (!status) errors.status = 'Status is required.';

		return errors;
	}

	// map a server error response (400/409) to field-level errors for inline form display
	function mapServerErrors(error) {
		const payload = error?.data || error || {};
		const message = String(payload.message || error?.message || 'Request failed.');
		const errors = {};
		const lowerMsg = message.toLowerCase();

		if (payload.errors && typeof payload.errors === 'object') {
			Object.entries(payload.errors).forEach(([key, value]) => {
				errors[String(key).replace(/[^a-z]/gi, '')] = Array.isArray(value) ? value[0] : String(value);
			});
			return errors;
		}

		const field = ['email', 'username', 'password', 'phone', 'department', 'designation', 'salary', 'status']
			.find(keyword => lowerMsg.includes(keyword)) || 'username';
		errors[field] = message;

		return errors;
	}

	return { validateAuthForm, validateEmployeeForm, mapServerErrors };
})();

globalThis.validationService = validationService;

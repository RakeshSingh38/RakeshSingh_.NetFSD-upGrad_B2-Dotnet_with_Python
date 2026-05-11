// authService - handles login, signup, and user session management
// stores JWT token in memory after login; exposes getToken() for API requests
const authService = (function () {
	const root = globalThis;
	let loggedInUser = null;

	const hasApi = () => typeof root.API_BASE_URL === 'string' && typeof fetch === 'function';
	const clone = value => value ? JSON.parse(JSON.stringify(value)) : value;

	const findUser = username =>
		Array.isArray(root.admins) ? root.admins.find(admin => admin.username.toLowerCase() === String(username).toLowerCase()) : null;

	function setSession(user) {
		loggedInUser = user ? clone(user) : null;
	}

	// register a new user account (admin or viewer role)
	function signup(username, password, role = 'Admin') {
		const normalizedUsername = String(username || '').trim();
		const normalizedPassword = String(password || '');
		const normalizedRole = String(role).trim();

		if (normalizedPassword.length < 6) {
			return { success: false, message: 'Password must be at least 6 characters.' };
		}

		if (!hasApi()) {
			if (findUser(normalizedUsername)) {
				return { success: false, message: 'Username already exists.' };
			}
			if (!Array.isArray(root.admins)) root.admins = [];
			root.admins.push({ username: normalizedUsername, password: normalizedPassword, role: normalizedRole });
			return { success: true, message: 'Signup successful, please sign in.' };
		}

		return fetch(`${root.API_BASE_URL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: normalizedUsername, password: normalizedPassword, role: normalizedRole })
		})
			.then(async response => {
				const payload = await response.json().catch(() => null);
				if (!response.ok) {
					return { success: false, message: payload?.message || 'Registration failed.' };
				}
				setSession({ username: payload.username, role: payload.role, token: payload.token });
				return { success: true, message: payload.message || 'Registration successful.', username: payload.username, role: payload.role, token: payload.token, user: { username: payload.username } };
			})
			.catch(error => ({ success: false, message: error?.message || 'Registration failed.' }));
	}

	// log in with username and password - stores JWT token in memory on success
	function login(username, password) {
		const normalizedUsername = String(username || '').trim();
		const normalizedPassword = String(password || '');

		if (!hasApi()) {
			const user = findUser(normalizedUsername);
			if (!user || user.password !== normalizedPassword) {
				return { success: false, message: 'Invalid credentials.' };
			}
			setSession({ username: user.username });
			return { success: true, message: 'Login successful.', user: { username: user.username } };
		}

		return fetch(`${root.API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: normalizedUsername, password: normalizedPassword })
		})
			.then(async response => {
				const payload = await response.json().catch(() => null);
				if (!response.ok || !payload?.success) {
					return { success: false, message: payload?.message || 'Invalid credentials.' };
				}
				setSession({ username: payload.username, role: payload.role, token: payload.token });
				return { success: true, message: payload.message || 'Login successful.', username: payload.username, role: payload.role, token: payload.token, user: { username: payload.username } };
			})
			.catch(error => ({ success: false, message: error?.message || 'Invalid credentials.' }));
	}

	// clear the current session (user must log in again)
	function logout() {
		setSession(null);
	}

	// check if someone is currently logged in
	function isLoggedIn() {
		return !!loggedInUser?.token || (!!loggedInUser && !hasApi());
	}

	// check if the current user is an Admin
	function isAdmin() {
		return String(loggedInUser?.role || '').toLowerCase() === 'admin';
	}

	// get a copy of the current session (username, role, token)
	function getCurrentUser() {
		return loggedInUser ? clone(loggedInUser) : null;
	}

	// get the JWT token - attached as Bearer header on every API request
	function getToken() {
		return loggedInUser?.token || null;
	}

	return { signup, login, logout, isLoggedIn, getCurrentUser, getToken, isAdmin };
})();

globalThis.authService = authService;

const authService = (function () {
	let loggedInUser = null;

	const findUser = username =>
		admins.find(admin => admin.username.toLowerCase() === String(username).toLowerCase());

	function signup(username, password) {
		if (String(password || '').length < 6)
			return { success: false, message: 'Password must be at least 6 characters' };
		if (findUser(username))
			return { success: false, message: 'Username already exists' };
		admins.push({ username, password });
		return { success: true, message: 'Signup successful, please sign in' };
	}

	function login(username, password) {
		const user = findUser(username);
		if (!user || user.password !== password)
			return { success: false, message: 'Invalid credentials' };
		loggedInUser = { username: user.username };
		return { success: true, user: loggedInUser };
	}

	const logout      = () => { loggedInUser = null; };
	const isLoggedIn  = () => loggedInUser !== null;
	const getCurrentUser = () => loggedInUser;

	return { signup, login, logout, isLoggedIn, getCurrentUser };
})();

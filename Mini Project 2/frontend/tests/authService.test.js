const { loadServices } = require('./testLoader');

describe('authService', () => {
    const mockAdmins = [
        { username: 'admin', password: 'admin123' }
    ];

    function setup() {
        return loadServices({
            admins: mockAdmins,
            scripts: ['authService.js']
        }).authService;
    }

    test('signup fails for duplicate username', () => {
        const authService = setup();
        const result = authService.signup('admin', 'newpass123');

        expect(result.success).toBe(false);
        expect(result.message).toMatch(/exists/i);
    });

    test('signup fails for short password', () => {
        const authService = setup();
        const result = authService.signup('rakesh', '12345');

        expect(result.success).toBe(false);
        expect(result.message).toMatch(/at least 6/i);
    });

    test('signup succeeds for new valid user', () => {
        const authService = setup();
        const result = authService.signup('rakesh', 'secure123');

        expect(result.success).toBe(true);
        expect(result.message).toMatch(/signup successful/i);
    });

    test('login success and failure cases are handled correctly', () => {
        const authService = setup();

        const failure = authService.login('admin', 'wrong-pass');
        expect(failure.success).toBe(false);

        const success = authService.login('admin', 'admin123');
        expect(success.success).toBe(true);
        expect(success.user).toEqual({ username: 'admin' });
    });

    test('session state changes after login and logout', () => {
        const authService = setup();

        expect(authService.isLoggedIn()).toBe(false);
        expect(authService.getCurrentUser()).toBeNull();

        authService.login('admin', 'admin123');
        expect(authService.isLoggedIn()).toBe(true);
        expect(authService.getCurrentUser()).toEqual({ username: 'admin' });

        authService.logout();
        expect(authService.isLoggedIn()).toBe(false);
        expect(authService.getCurrentUser()).toBeNull();
    });
});

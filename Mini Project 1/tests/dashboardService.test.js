const { loadServices } = require('./testLoader');

describe('dashboardService', () => {
    const mockEmployees = [
        { id: 1, firstName: 'A', lastName: 'One', email: 'a@x.com', phone: '9999999991', department: 'Engineering', designation: 'Dev', salary: 600000, joinDate: '2025-01-01', status: 'Active' },
        { id: 2, firstName: 'B', lastName: 'Two', email: 'b@x.com', phone: '9999999992', department: 'Engineering', designation: 'QA', salary: 500000, joinDate: '2025-02-01', status: 'Inactive' },
        { id: 3, firstName: 'C', lastName: 'Three', email: 'c@x.com', phone: '9999999993', department: 'HR', designation: 'HR', salary: 450000, joinDate: '2025-05-01', status: 'Active' },
        { id: 4, firstName: 'D', lastName: 'Four', email: 'd@x.com', phone: '9999999994', department: 'Marketing', designation: 'SEO', salary: 550000, joinDate: '2026-06-01', status: 'Inactive' },
        { id: 5, firstName: 'E', lastName: 'Five', email: 'e@x.com', phone: '9999999995', department: 'Marketing', designation: 'Lead', salary: 750000, joinDate: '2026-03-01', status: 'Active' }
    ];

    function setup(customEmployees) {
        return loadServices({
            employees: customEmployees || mockEmployees,
            scripts: ['storageService.js', 'employeeService.js', 'dashboardService.js']
        }).dashboardService;
    }

    test('getSummary returns correct totals', () => {
        const dashboardService = setup();
        const summary = dashboardService.getSummary();

        expect(summary).toEqual({
            total: 5,
            active: 3,
            inactive: 2,
            departments: 3
        });
    });

    test('getDepartmentBreakdown returns accurate per-department counts', () => {
        const dashboardService = setup();
        const breakdown = dashboardService.getDepartmentBreakdown();

        expect(breakdown).toEqual([
            { department: 'Engineering', count: 2, percentage: 40 },
            { department: 'HR', count: 1, percentage: 20 },
            { department: 'Marketing', count: 2, percentage: 40 }
        ]);
    });

    test('getRecentEmployees(n) returns last n by id descending', () => {
        const dashboardService = setup();
        const recent = dashboardService.getRecentEmployees(3);

        expect(recent.map((emp) => emp.id)).toEqual([5, 4, 3]);
    });

    test('getRecentEmployees handles n larger than total', () => {
        const dashboardService = setup();
        const recent = dashboardService.getRecentEmployees(20);

        expect(recent).toHaveLength(5);
        expect(recent[0].id).toBe(5);
        expect(recent[4].id).toBe(1);
    });
});

const { loadServices } = require('./testLoader');

describe('employeeService', () => {
    const mockEmployees = [
        {
            id: 1,
            firstName: 'Priya',
            lastName: 'Prabhu',
            email: 'priya.prabhu@hexacore.com',
            phone: '9999999991',
            department: 'Engineering',
            designation: 'Software Engineer',
            salary: 850000,
            joinDate: '2025-03-15',
            status: 'Active'
        },
        {
            id: 2,
            firstName: 'Arjun',
            lastName: 'Sharma',
            email: 'arjun.sharma@hexacore.com',
            phone: '9999999992',
            department: 'Marketing',
            designation: 'Marketing Executive',
            salary: 620000,
            joinDate: '2025-07-01',
            status: 'Active'
        },
        {
            id: 3,
            firstName: 'Ananya',
            lastName: 'Singh',
            email: 'ananya.singh@hexacore.com',
            phone: '9999999993',
            department: 'Marketing',
            designation: 'Content Strategist',
            salary: 580000,
            joinDate: '2026-02-28',
            status: 'Inactive'
        },
        {
            id: 4,
            firstName: 'Vikram',
            lastName: 'Raj',
            email: 'vikram.raj@hexacore.com',
            phone: '9999999994',
            department: 'Finance',
            designation: 'Analyst',
            salary: 720000,
            joinDate: '2025-01-10',
            status: 'Active'
        }
    ];

    function setup() {
        return loadServices({
            employees: mockEmployees,
            scripts: ['storageService.js', 'employeeService.js']
        }).employeeService;
    }

    test('getAll and getById return expected data', () => {
        const employeeService = setup();
        expect(employeeService.getAll()).toHaveLength(4);
        expect(employeeService.getById(2).lastName).toBe('Sharma');
        expect(employeeService.getById(999)).toBeNull();
    });

    test('add creates new employee with normalized fields and next id', () => {
        const employeeService = setup();
        const created = employeeService.add({
            firstName: '  Kiran ',
            lastName: ' Das ',
            email: ' KIRAN.DAS@HEXACORE.COM ',
            phone: '9999999995',
            department: 'HR',
            designation: 'HR Executive',
            salary: '510000',
            joinDate: '2026-06-01',
            status: 'Active'
        });

        expect(created.id).toBe(5);
        expect(created.firstName).toBe('Kiran');
        expect(created.email).toBe('kiran.das@hexacore.com');
        expect(created.salary).toBe(510000);
        expect(employeeService.getAll()).toHaveLength(5);
    });

    test('update modifies existing employee and remove deletes employee', () => {
        const employeeService = setup();

        const updated = employeeService.update(3, {
            firstName: 'Ananya',
            lastName: 'Singh',
            email: 'ananya.singh@hexacore.com',
            phone: '9999999993',
            department: 'Marketing',
            designation: 'Senior Content Strategist',
            salary: 640000,
            joinDate: '2026-02-28',
            status: 'Active'
        });

        expect(updated.designation).toBe('Senior Content Strategist');
        expect(updated.status).toBe('Active');

        const removed = employeeService.remove(2);
        expect(removed.email).toBe('arjun.sharma@hexacore.com');
        expect(employeeService.getById(2)).toBeNull();
        expect(employeeService.getAll()).toHaveLength(3);
    });

    test('search matches full name and email case-insensitively', () => {
        const employeeService = setup();

        const byName = employeeService.search('priya pra');
        expect(byName).toHaveLength(1);
        expect(byName[0].id).toBe(1);

        const byEmail = employeeService.search('ARJUN.SHARMA@HEXACORE.COM');
        expect(byEmail).toHaveLength(1);
        expect(byEmail[0].id).toBe(2);
    });

    test('filterByDepartment and filterByStatus work correctly', () => {
        const employeeService = setup();

        const marketing = employeeService.filterByDepartment('Marketing');
        expect(marketing).toHaveLength(2);

        const inactive = employeeService.filterByStatus('Inactive');
        expect(inactive).toHaveLength(1);
        expect(inactive[0].id).toBe(3);
    });

    test('applyFilters uses AND logic across search, department and status', () => {
        const employeeService = setup();

        const filtered = employeeService.applyFilters('ananya', 'Marketing', 'Inactive');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe(3);

        const none = employeeService.applyFilters('ananya', 'Engineering', 'Inactive');
        expect(none).toHaveLength(0);
    });

    test('sortBy supports name, salary and joinDate directions', () => {
        const employeeService = setup();
        const list = employeeService.getAll();

        const nameAsc = employeeService.sortBy('name', 'asc', list);
        expect(nameAsc[0].lastName).toBe('Prabhu');

        const salaryDesc = employeeService.sortBy('salary', 'desc', list);
        expect(salaryDesc[0].salary).toBe(850000);

        const joinDateDesc = employeeService.sortBy('joinDate', 'desc', list);
        expect(joinDateDesc[0].id).toBe(3);
    });
});

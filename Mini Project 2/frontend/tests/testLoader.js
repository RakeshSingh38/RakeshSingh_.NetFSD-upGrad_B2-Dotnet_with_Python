const fs = require('fs');
const path = require('path');
const vm = require('vm');

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function loadServices(options) {
    const opts = options || {};
    const employees = clone(opts.employees || []);
    const admins = clone(opts.admins || []);
    const scripts = opts.scripts || [];

    const context = { console, employees, admins };
    context.globalThis = context;
    vm.createContext(context);

    const exportMap = {
        'storageService.js': 'storageService',
        'employeeService.js': 'employeeService',
        'authService.js': 'authService',
        'dashboardService.js': 'dashboardService',
        'validationService.js': 'validationService'
    };

    scripts.forEach((fileName) => {
        const filePath = path.join(__dirname, '..', 'js', fileName);
        const code = fs.readFileSync(filePath, 'utf8');
        const symbol = exportMap[fileName];
        const wrapped = symbol ? code + '\n;globalThis.' + symbol + ' = ' + symbol + ';' : code;
        vm.runInContext(wrapped, context, { filename: fileName });
    });

    return context;
}

module.exports = { loadServices };

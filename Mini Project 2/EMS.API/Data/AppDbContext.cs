using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<AppUser> AppUsers => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Salary).HasPrecision(18, 2);
        });

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasIndex(x => x.Username).IsUnique();
        });

        var seededAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1,  FirstName = "Pooja",   LastName = "Ghosh",    Email = "pooja.ghosh@xyz.com",    Phone = "9876543201", Department = "Engineering", Designation = "DevOps Engineer",       Salary = 980000,  JoinDate = new DateTime(2025, 3,  10, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 2,  FirstName = "Amit",    LastName = "Joshi",    Email = "amit.joshi@xyz.com",     Phone = "9876543202", Department = "Operations",   Designation = "Supply Chain Analyst",  Salary = 720000,  JoinDate = new DateTime(2025, 11, 18, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 3,  FirstName = "Lakshmi", LastName = "Chandran", Email = "lakshmi.chandran@xyz.com",Phone = "9876543203", Department = "Marketing",    Designation = "Brand Manager",         Salary = 840000,  JoinDate = new DateTime(2025, 7,  22, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 4,  FirstName = "Suresh",  LastName = "Babu",     Email = "suresh.babu@xyz.com",    Phone = "9876543204", Department = "Finance",      Designation = "Tax Consultant",        Salary = 910000,  JoinDate = new DateTime(2025, 5,  14, 0, 0, 0, DateTimeKind.Utc), Status = "Inactive", CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 5,  FirstName = "Meera",   LastName = "Krishnan", Email = "meera.krishnan@xyz.com", Phone = "9876543205", Department = "Engineering", Designation = "QA Engineer",           Salary = 690000,  JoinDate = new DateTime(2026, 1,  16, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 6,  FirstName = "Rohan",   LastName = "Kapoor",   Email = "rohan.kapoor@xyz.com",   Phone = "9876543206", Department = "Engineering", Designation = "Software Engineer",     Salary = 830000,  JoinDate = new DateTime(2026, 8,  3,  0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 7,  FirstName = "Ananya",  LastName = "Sen",      Email = "ananya.sen@xyz.com",     Phone = "9876543207", Department = "HR",           Designation = "HR Executive",          Salary = 620000,  JoinDate = new DateTime(2025, 2,  10, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 8,  FirstName = "Karthik", LastName = "Iyer",     Email = "karthik.iyer@xyz.com",   Phone = "9876543208", Department = "Finance",      Designation = "Accounts Manager",     Salary = 990000,  JoinDate = new DateTime(2025, 10, 30, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 9,  FirstName = "Nisha",   LastName = "Verma",    Email = "nisha.verma@xyz.com",    Phone = "9876543209", Department = "Marketing",    Designation = "SEO Specialist",        Salary = 570000,  JoinDate = new DateTime(2026, 1,  9,  0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 10, FirstName = "Harish",  LastName = "Naidu",    Email = "harish.naidu@xyz.com",   Phone = "9876543210", Department = "Operations",   Designation = "Logistics Manager",    Salary = 810000,  JoinDate = new DateTime(2025, 4,  17, 0, 0, 0, DateTimeKind.Utc), Status = "Inactive", CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 11, FirstName = "Ritika",  LastName = "Sharma",   Email = "ritika.sharma@xyz.com",  Phone = "9876543211", Department = "HR",           Designation = "Talent Partner",        Salary = 760000,  JoinDate = new DateTime(2026, 6,  1,  0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 12, FirstName = "Vikas",   LastName = "Nair",     Email = "vikas.nair@xyz.com",     Phone = "9876543212", Department = "Engineering", Designation = "Backend Developer",     Salary = 1040000, JoinDate = new DateTime(2025, 12, 11, 0, 0, 0, DateTimeKind.Utc), Status = "Inactive", CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 13, FirstName = "Sneha",   LastName = "Kulkarni", Email = "sneha.kulkarni@xyz.com", Phone = "9876543213", Department = "Marketing",    Designation = "Content Strategist",    Salary = 680000,  JoinDate = new DateTime(2026, 5,  26, 0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 14, FirstName = "Prakash", LastName = "Yadav",    Email = "prakash.yadav@xyz.com",  Phone = "9876543214", Department = "Operations",   Designation = "Process Lead",          Salary = 880000,  JoinDate = new DateTime(2025, 9,  7,  0, 0, 0, DateTimeKind.Utc), Status = "Active",   CreatedAt = seededAt, UpdatedAt = seededAt },
            new Employee { Id = 15, FirstName = "Farah",   LastName = "Ali",      Email = "farah.ali@xyz.com",      Phone = "9876543215", Department = "Finance",      Designation = "Financial Analyst",     Salary = 790000,  JoinDate = new DateTime(2026, 8,  19, 0, 0, 0, DateTimeKind.Utc), Status = "Inactive", CreatedAt = seededAt, UpdatedAt = seededAt }
        );

        modelBuilder.Entity<AppUser>().HasData(
            new AppUser { Id = 1, Username = "admin",  PasswordHash = "$2a$12$ipndEf/1p9jdMYbdUWDDrOF1LRVlvxI3tRErZYb5tQzjG2YUPOUyC", Role = "Admin",  CreatedAt = seededAt },
            new AppUser { Id = 2, Username = "viewer", PasswordHash = "$2a$12$eWJKQBW5QfPnc8JsxDl9k.aQAetORxOMGEsaNdyrRzzzKhcTnvJSO", Role = "Viewer", CreatedAt = seededAt }
        );
    }

    public override int SaveChanges()
    {
        ApplyTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyTimestamps()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<Employee>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = utcNow;
                entry.Entity.UpdatedAt = utcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(x => x.CreatedAt).IsModified = false;
                entry.Entity.UpdatedAt = utcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<AppUser>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = utcNow;
        }
    }
}
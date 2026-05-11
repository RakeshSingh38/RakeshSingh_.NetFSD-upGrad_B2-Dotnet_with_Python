using System;
class Program
{
    static void Main()
    {
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("admin123", workFactor: 12));
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("viewer123", workFactor: 12));
    }
}

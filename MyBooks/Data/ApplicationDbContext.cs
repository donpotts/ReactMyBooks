using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyBooks.Models;
using MyBooks.Shared.Models;

namespace MyBooks.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Book> Book => Set<Book>();
    public DbSet<Author> Author => Set<Author>();
    public DbSet<Category> Category => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Book>()
            .Property(e => e.Price)
            .HasConversion<double>();
        modelBuilder.Entity<Book>()
            .Property(e => e.Price)
            .HasPrecision(19, 4);
        modelBuilder.Entity<Book>()
            .HasMany(x => x.Author);
        modelBuilder.Entity<Book>()
            .HasMany(x => x.Category);
        modelBuilder.Entity<Author>()
            .HasMany(x => x.Book);
        modelBuilder.Entity<Category>()
            .HasMany(x => x.Book);
    }
}

using System;
using System.Collections.Generic;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Context;

public partial class MySQLContext : DbContext
{
    public MySQLContext(DbContextOptions<MySQLContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Recording> Recordings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recording>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_Recording");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.User).WithMany(p => p.Recordings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Recording_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_User");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

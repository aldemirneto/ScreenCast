using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[Table("User", Schema = "dbo")]
public partial class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("email")]
    [StringLength(350)]
    public string Email { get; set; } = null!;

    [Column("password")]
    [StringLength(500)]
    public string Password { get; set; } = null!;

    [Column("is_subscribed")]
    public bool? IsSubscribed { get; set; }

    [Column("created_at", TypeName = "timestamp(3) without time zone")]
    public DateTime CreatedAt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Recording> Recordings { get; set; } = new List<Recording>();
}

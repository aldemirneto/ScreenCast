using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[Table("Recording", Schema = "dbo")]
public partial class Recording
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("created_at", TypeName = "timestamp(3) without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("finished_at", TypeName = "timestamp(3) without time zone")]
    public DateTime? FinishedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Recordings")]
    public virtual User User { get; set; } = null!;
}

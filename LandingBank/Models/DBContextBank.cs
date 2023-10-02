using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace LandingBank.Models
{
    public partial class DBContextBank : DbContext
    {
        public DBContextBank()
            : base("name=DBContextBankConnection")
        {
        }

        public virtual DbSet<Client> Clients { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}

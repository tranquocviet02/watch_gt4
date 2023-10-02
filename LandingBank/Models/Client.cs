namespace LandingBank.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Client")]
    public partial class Client
    {
        public int id { get; set; }

        [StringLength(50)]
        public string UserName { get; set; }

        [StringLength(13)]
        public string PhoneNumber { get; set; }

        [StringLength(200)]
        public string Adress { get; set; }

        [StringLength(10)]
        public string ReferralCode { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? dateTime0 { get; set; }
    }
}

using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyPhogGym._Business.LichLamViec.Entity
{
    public class LichLamViec : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public LichLamViec() : base()
        {

        }

        [Required]
        public Guid ID_HLV { get; set; }

        public string TenLich { get; set; }

        public string ChiTiet { get; set; } 

        [ForeignKey("ID_HLV")]
        public virtual HuanLuyenVien.Entity.HuanLuyenVien HuanLuyenVien { get; set; }

    }
}

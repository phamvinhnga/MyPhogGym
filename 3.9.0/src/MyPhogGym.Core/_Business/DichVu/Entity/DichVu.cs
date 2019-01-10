using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.DichVu.Entity
{
    public class DichVu : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public DichVu() : base()
        {

        }

        [Required]
        public string TenDichVu { get; set; }

        [Required]
        public int LoaiGoi { get; set; }

        [Required]
        public int BuoiTap { get; set; }

        [DefaultValue(0)]
        public int SoLuong { get; set; }

        [Required]
        [DefaultValue(0)]
        public decimal Gia { get; set; }

        public string GioBatDau { get; set; }

        public string GioKetThuc { get; set; }

        public DateTime? NgayBatDau { get; set; }

        public DateTime? NgayKetThuc { get; set; }

        public string LichTap { get; set; }
    }
}

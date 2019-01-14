using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.HuanLuyenVien.Entity
{
    public class HuanLuyenVien : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public HuanLuyenVien() : base()
        {
        }

        [Required]
        public string HoTen { get; set; }

        [Required]
        public string SDT { get; set; }

        [Required]
        public string DiaChi { get; set; }

        public string Email { get; set; }

        [Required]
        public int HopDong { get; set; }

        public DateTime? NgaySinh { get; set; }

        public DateTime? BatDauLam { get; set; }

        public DateTime? NghiViec { get; set; }

        public DateTime? NgayKiHopDong { get; set; }

        public DateTime? KetThuc { get; set; }

        public decimal Luong { get; set; }

        [Required]
        [DefaultValue(true)]
        public bool TrangThai { get; set; }

        public virtual List<LichLamViec.Entity.LichLamViec> LichLamViecs { get; set; }

    }
}

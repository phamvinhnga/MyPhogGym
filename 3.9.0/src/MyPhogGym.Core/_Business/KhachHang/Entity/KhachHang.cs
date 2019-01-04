﻿using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang.Entity
{
    public class KhachHang : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public KhachHang() : base()
        {
        }

        [Required]
        public string HoTen { get; set; }

        public string SDT { get; set; }

        public int GioiTinh { get; set; }

        public DateTime? NgaySinh { get; set; }

        public string GhiChu { get; set; }

        public Guid? DichVuID { get; set; }

        public DateTime? DangKy { get; set; }

        public int ConLai { get; set; }

        public string MaVach { get; set; }

        public string LichTap { get; set; }

        [ForeignKey("DichVuID")]
        public virtual DichVu.Entity.DichVu DichVu { get; set; }

        [DefaultValue(true)]
        public bool TrangThai { get; set; }
    }
}

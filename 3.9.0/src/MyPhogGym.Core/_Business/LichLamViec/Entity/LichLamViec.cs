using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyPhogGym._Business.LichLamViec.Entity
{
    public class LichLamViec : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public LichLamViec() : base()
        {
        }

        public Guid? HuanLuyenVienID { get; set; }

        public Guid? CaLamViecID { get; set; }

        [DefaultValue(false)]
        public bool ThuHai { get; set; }
        [DefaultValue(false)]
        public bool ThuBa { get; set; }
        [DefaultValue(false)]
        public bool ThuTu { get; set; }
        [DefaultValue(false)]
        public bool ThuNam { get; set; }
        [DefaultValue(false)]
        public bool ThuSau { get; set; }
        [DefaultValue(false)]
        public bool ThuBay { get; set; }
        [DefaultValue(false)]
        public bool ChuNhat { get; set; }

        [ForeignKey("HuanLuyenVienID")]
        public virtual HuanLuyenVien.Entity.HuanLuyenVien HuanLuyenVien { get; set; }

        [ForeignKey("CaLamViecID")]
        public virtual CaLamViec.Entity.CaLamViec CaLamViec { get; set; }

    }
}

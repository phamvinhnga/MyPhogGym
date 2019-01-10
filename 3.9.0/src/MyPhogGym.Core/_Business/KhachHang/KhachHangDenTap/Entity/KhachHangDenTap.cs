using Abp.Domain.Entities;
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

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap.Entity
{
    public class KhachHangDenTap : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public KhachHangDenTap() : base()
        {
        }

        [Required]
        public Guid? KhachHangID { get; set; }

        [ForeignKey("KhachHangID")]
        public virtual QuanLyKhachHang.Entity.KhachHang KhachHang { get; set; }

    }
}

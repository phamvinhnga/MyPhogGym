using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MyPhogGym.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.CaLamViec.Entity
{
    public class CaLamViec : FullAuditedEntity<Guid, User>, ISoftDelete
    {
        public CaLamViec() : base()
        {
        }

        [Required]
        public string TenCa { get; set; }

        [Required]
        public string BatDau { get; set; }

        [Required]
        public string KetThuc { get; set; }

        [Required]
        [DefaultValue(true)]
        public bool TrangThai { get; set; }

        public virtual List<LichLamViec.Entity.LichLamViec> LichLamViecs { get; set; }
    }
}

using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec.Dto
{
    [AutoMapTo(typeof(Entity.LichLamViec))]
    public class LichLamViecDto : EntityDto<Guid>
    {
        [Required]
        public Guid ID_HLV { get; set; }

        public string TenLich { get; set; }

        public string ChiTiet { get; set; }

        public virtual GetHoTenTrangThaiHuanLuyenVienDto HuanLuyenVien {get;set;}
    }
}

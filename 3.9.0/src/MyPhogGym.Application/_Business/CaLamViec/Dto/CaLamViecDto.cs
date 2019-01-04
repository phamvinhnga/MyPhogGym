using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.CaLamViec.Dto
{
    [AutoMapTo(typeof(Entity.CaLamViec))]
    public class CaLamViecDto : EntityDto<Guid>
    {
        [Required]
        public string TenCa { get; set; }

        [Required]
        public string BatDau { get; set; }

        [Required]
        public string KetThuc { get; set; }

        [Required]
        [DefaultValue(true)]
        public bool TrangThai { get; set; }
    }

    [AutoMapTo(typeof(Entity.CaLamViec))]
    public class CaLamViecTenCaDto : EntityDto<Guid>
    {
        [Required]
        public string TenCa { get; set; }
    }
}

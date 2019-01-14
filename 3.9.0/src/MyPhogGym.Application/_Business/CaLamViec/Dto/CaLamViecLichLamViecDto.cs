using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.LichLamViec.Dto;
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
    public class CaLamViecLichLamViecDto : EntityDto<Guid>
    {
        public string TenCa { get; set; }
    }
}

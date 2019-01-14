using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.LichLamViec.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.HuanLuyenVien.Dto
{
    [AutoMapTo(typeof(Entity.HuanLuyenVien))]
    public class HuanLuyenVienLichLamViecDto : EntityDto<Guid>
    {
        public string HoTen { get; set; }

        public List<LichLamViecDto> LichLamViecs { get; set; }
    }
}

using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.CaLamViec.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec.Dto
{
    [AutoMapTo(typeof(Entity.LichLamViec))]
    public class CreateUpdateLichLamViecInput : EntityDto<Guid>
    {
        [Required]
        public Guid? HuanLuyenVienID { get; set; }

        [Required]
        public Guid? CaLamViecID { get; set; }

        public bool ThuHai { get; set; }

        public bool ThuBa { get; set; }

        public bool ThuTu { get; set; }

        public bool ThuNam { get; set; }

        public bool ThuSau { get; set; }

        public bool ThuBay { get; set; }

        public bool ChuNhat { get; set; }
    }
}

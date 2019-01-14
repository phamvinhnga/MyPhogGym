using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using System;

namespace MyPhogGym._Business.LichLamViec.Dto
{
    [AutoMapTo(typeof(Entity.LichLamViec))]
    public class LichLamViecHuanLuyenVienDto : EntityDto<Guid>
    {
        public Guid? HuanLuyenVienID { get; set; }

        public bool ThuHai { get; set; }

        public bool ThuBa { get; set; }

        public bool ThuTu { get; set; }

        public bool ThuNam { get; set; }

        public bool ThuSau { get; set; }

        public bool ThuBay { get; set; }

        public bool ChuNhat { get; set; }

        public HuanLuyenVienDto HuanLuyenVien { get; set; }
    }

}

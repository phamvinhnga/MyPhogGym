using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap.Dto
{
    [AutoMapTo(typeof(Entity.KhachHangDenTap))]
    public class KhachHangDenTapDto : EntityDto<Guid>
    {
        public Guid KhachHangID { get; set; }

        public DateTime? CreationTime { get; set; }

        public QuanLyKhachHang.Dto.KhachHangDto khachHang { get; set; }
    }
}

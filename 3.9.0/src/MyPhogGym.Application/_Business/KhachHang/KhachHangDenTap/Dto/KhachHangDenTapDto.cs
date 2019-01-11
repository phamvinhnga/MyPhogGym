using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel;

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap.Dto
{
    [AutoMapTo(typeof(Entity.KhachHangDenTap))]
    public class KhachHangDenTapDto : EntityDto<Guid>
    {
        public Guid KhachHangID { get; set; }

        public int SoPhutConlai { get; set; }

        public bool TrangThai { get; set; }

        public DateTime? CreationTime { get; set; }

        public QuanLyKhachHang.Dto.KhachHangDto KhachHang { get; set; }
    }
}

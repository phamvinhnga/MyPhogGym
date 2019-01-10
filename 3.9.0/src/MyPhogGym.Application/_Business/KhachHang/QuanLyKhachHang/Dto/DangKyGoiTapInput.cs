using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.KhachHang.QuanLyKhachHang.Dto
{
    [AutoMapTo(typeof(Entity.KhachHang))]
    public class GoiTapKhachHangInput : EntityDto<Guid>
    {
        public Guid? DichVuID { get; set; }

        public DateTime? NgayDangKy { get; set; }

        public int ConLai { get; set; }
    }
}

using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.KhachHang.QuanLyKhachHang.Dto
{
    [AutoMapTo(typeof(Entity.KhachHang))]
    public class KhachHangDto : EntityDto<Guid>
    {
        public string HoTen { get; set; }

        public string SDT { get; set; }

        public int GioiTinh { get; set; }

        public DateTime? NgaySinh { get; set; }

        public string GhiChu { get; set; }

        public DateTime? NgayDangKy { get; set; }

        public int ConLai { get; set; }

        public virtual DichVu.Dto.DichVuDto DichVu { get; set; }
    }
}

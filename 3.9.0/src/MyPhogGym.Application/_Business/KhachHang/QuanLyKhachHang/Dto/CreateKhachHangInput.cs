using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.KhachHang.QuanLyKhachHang.Dto
{
    [AutoMapTo(typeof(Entity.KhachHang))]
    public class CreateKhachHangInput : EntityDto<Guid>
    {
        [Required]
        public string HoTen { get; set; }
        [Required]
        public string SDT { get; set; }
        [Required]
        public int GioiTinh { get; set; }
        [Required]
        public DateTime? NgaySinh { get; set; }

        public string GhiChu { get; set; }
    }
}

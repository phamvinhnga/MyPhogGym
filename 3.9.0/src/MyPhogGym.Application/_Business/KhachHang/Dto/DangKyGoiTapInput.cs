using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.KhachHang.Dto
{
    [AutoMapTo(typeof(Entity.KhachHang))]
    public class DangKyGoiTapInput : EntityDto<Guid>
    {
        [Required]
        public Guid? DichVuID { get; set; }

        [Required]
        public DateTime? DangKy { get; set; }

        public int ConLai { get; set; }

        public string LichTap { get; set; }
    }

    [AutoMapTo(typeof(Entity.KhachHang))]
    public class HuyGoiTapInput : EntityDto<Guid>
    {
        public Guid? DichVuID { get; set; }

        public DateTime? DangKy { get; set; }

        public int ConLai { get; set; }

        public string LichTap { get; set; }
    }
}

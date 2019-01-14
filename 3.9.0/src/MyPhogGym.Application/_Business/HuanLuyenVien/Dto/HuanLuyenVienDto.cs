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

namespace MyPhogGym._Business.HuanLuyenVien.Dto
{
    [AutoMapTo(typeof(Entity.HuanLuyenVien))]
    public class HuanLuyenVienDto : EntityDto<Guid>
    {
        public HuanLuyenVienDto() : base()
        {
        }

        [Required]
        public string HoTen { get; set; }

        [Required]
        public string SDT { get; set; }

        [Required]
        public string DiaChi { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public int HopDong { get; set; }

        public decimal Luong { get; set; }

        [Required]
        [DefaultValue(true)]
        public bool TrangThai { get; set; }

        public DateTime? NgaySinh { get; set; }

        public DateTime? BatDauLam { get; set; }

        public DateTime? NghiViec { get; set; }

        public DateTime? NgayKiHopDong { get; set; }

        public DateTime? KetThuc { get; set; }
    }

}

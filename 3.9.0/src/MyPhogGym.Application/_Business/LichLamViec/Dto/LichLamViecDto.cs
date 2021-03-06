﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using MyPhogGym._Business.CaLamViec.Dto;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using System;
using System.ComponentModel.DataAnnotations;

namespace MyPhogGym._Business.LichLamViec.Dto
{
    [AutoMapTo(typeof(Entity.LichLamViec))]
    public class LichLamViecDto : EntityDto<Guid>
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

        public CaLamViecLichLamViecDto CaLamViec { get; set; }

    }
}

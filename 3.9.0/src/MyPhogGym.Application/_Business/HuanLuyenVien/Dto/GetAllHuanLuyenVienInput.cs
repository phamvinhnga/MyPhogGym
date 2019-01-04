using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.HuanLuyenVien.Dto
{
    [AutoMapTo(typeof(Entity.HuanLuyenVien))]
    public class GetAllHuanLuyenVienInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public int FilterTrangThai { get; set; }

        public int FilterHopDong { get; set; }

        public string KeySearch { get; set; }
    }
}

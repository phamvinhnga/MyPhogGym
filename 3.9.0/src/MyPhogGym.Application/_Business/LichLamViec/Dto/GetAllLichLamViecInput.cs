using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec.Dto
{
    [AutoMapTo(typeof(Entity.LichLamViec))]
    public class GetAllLichLamViecInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public string KeySearch { get; set; }
        public int FilterTrangThai { get; set; }
    }
}

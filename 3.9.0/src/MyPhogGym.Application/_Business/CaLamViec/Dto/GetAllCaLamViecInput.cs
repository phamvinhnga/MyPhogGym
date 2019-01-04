using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.CaLamViec.Dto
{
    [AutoMapTo(typeof(Entity.CaLamViec))]
    public class GetAllCaLamViecInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public int FilterTrangThai { get; set; }

        public string KeySearch { get; set; }
    }
}

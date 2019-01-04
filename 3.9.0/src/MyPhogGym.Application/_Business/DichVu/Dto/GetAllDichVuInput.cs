using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace MyPhogGym._Business.DichVu.Dto
{
    [AutoMapTo(typeof(Entity.DichVu))]
    public class GetAllDichVuInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public string KeySearch { get; set; }
    }
}

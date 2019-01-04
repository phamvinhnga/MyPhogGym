using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace MyPhogGym._Business.KhachHang.Dto
{
    [AutoMapTo(typeof(Entity.KhachHang))]
    public class GetAllKhachHangInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public string KeySearch { get; set; }
    }
}

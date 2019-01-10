using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap.Dto
{
    [AutoMapTo(typeof(Entity.KhachHangDenTap))]
    public class GetAllKhachHangDenTapInput : PagedAndSortedResultRequestDto, IPagedResultRequest
    {
        public string KeySearch { get; set; }
    }
}

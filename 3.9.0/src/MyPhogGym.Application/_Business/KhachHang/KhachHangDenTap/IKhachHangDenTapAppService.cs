using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym._Business.KhachHang.KhachHangDenTap.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap
{
    public interface IKhachHangDenTapAppService : IAsyncCrudAppService <KhachHangDenTapDto, Guid, GetAllKhachHangDenTapInput>, IApplicationService
    {
        Task<string> KhachHangQuetThe(EntityDto<Guid> input);
    }
}

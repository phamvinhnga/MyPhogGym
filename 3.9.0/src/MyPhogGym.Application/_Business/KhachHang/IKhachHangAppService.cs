using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym._Business.KhachHang.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang
{
    public interface IKhachHangAppService : IAsyncCrudAppService<KhachHangDto, Guid, GetAllKhachHangInput, CreateKhachHangInput>, IApplicationService
    {
        Task<KhachHangDto> DangKyGoiTap(DangKyGoiTapInput input);

        Task<string> CreateBarCode(EntityDto<Guid> input);

        Task<KhachHangDto> HuyGoiTap(HuyGoiTapInput input);

        string KhachHangQuetThe(EntityDto<Guid> input);
    }
}

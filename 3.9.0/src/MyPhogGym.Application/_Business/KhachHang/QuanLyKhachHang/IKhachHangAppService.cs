using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym._Business.KhachHang.QuanLyKhachHang.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang.QuanLyKhachHang
{
    public interface IKhachHangAppService : IAsyncCrudAppService<KhachHangDto, Guid, GetAllKhachHangInput, CreateKhachHangInput>, IApplicationService
    {
        Task<KhachHangDto> DangKyGoiTap(GoiTapKhachHangInput input);

        //Task<string> CreateBarCode(EntityDto<Guid> input);

        Task<KhachHangDto> HuyGoiTap(GoiTapKhachHangInput input);

        string KhachHangQuetThe(EntityDto<Guid> input);

    }
}

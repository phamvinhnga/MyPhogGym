using Abp.Application.Services;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using System;

namespace MyPhogGym._Business.HuanLuyenVien
{
    public interface IHuanLuyenVienAppService : IAsyncCrudAppService<HuanLuyenVienDto, Guid, GetAllHuanLuyenVienInput > , IApplicationService
    {
    }
}

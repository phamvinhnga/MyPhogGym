using Abp.Application.Services;
using MyPhogGym._Business.DichVu.Dto;
using System;

namespace MyPhogGym._Business.DichVu
{
    public interface IDichVuAppService : IAsyncCrudAppService<DichVuDto, Guid, GetAllDichVuInput>, IApplicationService
    {
    }
}

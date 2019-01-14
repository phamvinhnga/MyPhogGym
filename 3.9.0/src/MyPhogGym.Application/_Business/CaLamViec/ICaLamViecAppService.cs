using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym._Business.CaLamViec.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.CaLamViec
{
    public interface ICaLamViecAppService : IAsyncCrudAppService<CaLamViecDto, Guid, GetAllCaLamViecInput>, IApplicationService
    {
    }
}

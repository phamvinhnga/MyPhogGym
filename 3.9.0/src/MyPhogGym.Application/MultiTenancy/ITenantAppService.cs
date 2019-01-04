using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym.MultiTenancy.Dto;

namespace MyPhogGym.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

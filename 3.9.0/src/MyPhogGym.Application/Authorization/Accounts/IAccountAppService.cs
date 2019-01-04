using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization.Users;
using MyPhogGym.Authorization.Accounts.Dto;
using MyPhogGym.Authorization.Users;
using MyPhogGym.MultiTenancy;

namespace MyPhogGym.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}

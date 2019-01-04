using System.Threading.Tasks;
using Abp.Application.Services;
using MyPhogGym.Sessions.Dto;

namespace MyPhogGym.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}

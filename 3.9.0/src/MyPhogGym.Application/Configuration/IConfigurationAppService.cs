using System.Threading.Tasks;
using Abp.Application.Services;
using MyPhogGym.Configuration.Dto;

namespace MyPhogGym.Configuration
{
    public interface IConfigurationAppService: IApplicationService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
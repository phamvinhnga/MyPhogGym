using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using MyPhogGym.Configuration.Dto;

namespace MyPhogGym.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : MyPhogGymAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}

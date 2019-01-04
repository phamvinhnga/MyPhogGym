using Abp.Application.Services;
using Abp.Dependency;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.UserInfomation
{
    public interface IUserInfomationAppService : IApplicationService, ITransientDependency
    {
        string GetLoginUser();
    }
}

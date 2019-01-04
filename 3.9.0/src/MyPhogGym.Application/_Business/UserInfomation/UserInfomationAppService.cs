using Abp.Application.Services;
using Abp.Dependency;
using Abp.Runtime.Session;
using Microsoft.AspNet.Identity;
using MyPhogGym.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.UserInfomation
{
    public class UserInfomationAppService : ApplicationService , IUserInfomationAppService
    {
        private readonly UserManager _userManager;


        public UserInfomationAppService(UserManager userManager)
        {
            _userManager = userManager;
        }

        public string GetLoginUser()
        {
            var id = AbpSession.UserId;
            var user = _userManager.Users.Where(w => w.Id == id).First();
            return user.UserName;
        }
    }
}

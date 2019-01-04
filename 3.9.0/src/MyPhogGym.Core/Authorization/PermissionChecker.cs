using Abp.Authorization;
using MyPhogGym.Authorization.Roles;
using MyPhogGym.Authorization.Users;

namespace MyPhogGym.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}

using Abp.AutoMapper;
using MyPhogGym.Sessions.Dto;

namespace MyPhogGym.Web.Models.Account
{
    [AutoMapFrom(typeof(GetCurrentLoginInformationsOutput))]
    public class TenantChangeViewModel
    {
        public TenantLoginInfoDto Tenant { get; set; }
    }
}
using System.Linq;
using MyPhogGym.EntityFramework;
using MyPhogGym.MultiTenancy;

namespace MyPhogGym.Migrations.SeedData
{
    public class DefaultTenantCreator
    {
        private readonly MyPhogGymDbContext _context;

        public DefaultTenantCreator(MyPhogGymDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateUserAndRoles();
        }

        private void CreateUserAndRoles()
        {
            //Default tenant

            var defaultTenant = _context.Tenants.FirstOrDefault(t => t.TenancyName == Tenant.DefaultTenantName);
            if (defaultTenant == null)
            {
                _context.Tenants.Add(new Tenant {TenancyName = Tenant.DefaultTenantName, Name = Tenant.DefaultTenantName});
                _context.SaveChanges();
            }
        }
    }
}

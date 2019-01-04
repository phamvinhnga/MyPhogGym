using MyPhogGym.EntityFramework;
using EntityFramework.DynamicFilters;

namespace MyPhogGym.Migrations.SeedData
{
    public class InitialHostDbBuilder
    {
        private readonly MyPhogGymDbContext _context;

        public InitialHostDbBuilder(MyPhogGymDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            _context.DisableAllFilters();

            new DefaultEditionsCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();
        }
    }
}

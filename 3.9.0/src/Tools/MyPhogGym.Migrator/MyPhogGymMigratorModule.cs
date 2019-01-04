using System.Data.Entity;
using System.Reflection;
using Abp.Modules;
using MyPhogGym.EntityFramework;

namespace MyPhogGym.Migrator
{
    [DependsOn(typeof(MyPhogGymDataModule))]
    public class MyPhogGymMigratorModule : AbpModule
    {
        public override void PreInitialize()
        {
            Database.SetInitializer<MyPhogGymDbContext>(null);

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
using System.Data.Entity;
using System.Reflection;
using Abp.Modules;
using Abp.Zero.EntityFramework;
using MyPhogGym.EntityFramework;

namespace MyPhogGym
{
    [DependsOn(typeof(AbpZeroEntityFrameworkModule), typeof(MyPhogGymCoreModule))]
    public class MyPhogGymDataModule : AbpModule
    {
        public override void PreInitialize()
        {
            Database.SetInitializer(new CreateDatabaseIfNotExists<MyPhogGymDbContext>());

            Configuration.DefaultNameOrConnectionString = "Default";
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}

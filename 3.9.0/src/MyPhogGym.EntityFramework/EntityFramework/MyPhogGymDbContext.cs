using System.Data.Common;
using System.Data.Entity;
using Abp.Zero.EntityFramework;
using MyPhogGym.Authorization.Roles;
using MyPhogGym.Authorization.Users;
using MyPhogGym.MultiTenancy;

namespace MyPhogGym.EntityFramework
{
    public partial class MyPhogGymDbContext : AbpZeroDbContext<Tenant, Role, User>
    {
        //TODO: Define an IDbSet for your Entities...

        /* NOTE: 
         *   Setting "Default" to base class helps us when working migration commands on Package Manager Console.
         *   But it may cause problems when working Migrate.exe of EF. If you will apply migrations on command line, do not
         *   pass connection string name to base classes. ABP works either way.
         */
        public MyPhogGymDbContext()
            : base("Default")
        {

        }

        /* NOTE:
         *   This constructor is used by ABP to pass connection string defined in MyPhogGymDataModule.PreInitialize.
         *   Notice that, actually you will not directly create an instance of MyPhogGymDbContext since ABP automatically handles it.
         */
        public MyPhogGymDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {

        }

        //This constructor is used in tests
        public MyPhogGymDbContext(DbConnection existingConnection)
         : base(existingConnection, false)
        {

        }

        public MyPhogGymDbContext(DbConnection existingConnection, bool contextOwnsConnection)
         : base(existingConnection, contextOwnsConnection)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}

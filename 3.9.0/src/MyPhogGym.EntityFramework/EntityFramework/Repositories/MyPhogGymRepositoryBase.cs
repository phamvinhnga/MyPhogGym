using Abp.Domain.Entities;
using Abp.EntityFramework;
using Abp.EntityFramework.Repositories;

namespace MyPhogGym.EntityFramework.Repositories
{
    public abstract class MyPhogGymRepositoryBase<TEntity, TPrimaryKey> : EfRepositoryBase<MyPhogGymDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected MyPhogGymRepositoryBase(IDbContextProvider<MyPhogGymDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //add common methods for all repositories
    }

    public abstract class MyPhogGymRepositoryBase<TEntity> : MyPhogGymRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected MyPhogGymRepositoryBase(IDbContextProvider<MyPhogGymDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //do not add any method here, add to the class above (since this inherits it)
    }
}

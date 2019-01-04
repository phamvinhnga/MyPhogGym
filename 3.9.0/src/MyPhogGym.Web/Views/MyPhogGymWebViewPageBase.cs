using Abp.Web.Mvc.Views;

namespace MyPhogGym.Web.Views
{
    public abstract class MyPhogGymWebViewPageBase : MyPhogGymWebViewPageBase<dynamic>
    {

    }

    public abstract class MyPhogGymWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected MyPhogGymWebViewPageBase()
        {
            LocalizationSourceName = MyPhogGymConsts.LocalizationSourceName;
        }
    }
}
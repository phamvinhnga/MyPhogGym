using System.Reflection;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Abp.Hangfire;
using Abp.Hangfire.Configuration;
using Abp.Modules;
using Abp.Web.Mvc;
using Abp.Web.SignalR;
using Abp.Zero.Configuration;
using MyPhogGym.Api;
using Hangfire;
using System.Web.Http.Cors;
using System.Web.Http;
using Abp.Configuration.Startup;

namespace MyPhogGym.Web
{
    [DependsOn(
        typeof(MyPhogGymDataModule),
        typeof(MyPhogGymApplicationModule),
        typeof(MyPhogGymWebApiModule),
        typeof(AbpWebSignalRModule),
        //typeof(AbpHangfireModule), - ENABLE TO USE HANGFIRE INSTEAD OF DEFAULT JOB MANAGER
        typeof(AbpWebMvcModule))]
    public class MyPhogGymWebModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Enable database based localization
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            //Configure navigation/menu
            Configuration.Navigation.Providers.Add<MyPhogGymNavigationProvider>();

            //Configure Hangfire - ENABLE TO USE HANGFIRE INSTEAD OF DEFAULT JOB MANAGER
            //Configuration.BackgroundJobs.UseHangfire(configuration =>
            //{
            //    configuration.GlobalConfiguration.UseSqlServerStorage("Default");
            //});
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            EnableCors();

            //ConfigureSwaggerUi();

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

        }

        //private void ConfigureSwaggerUi()
        //{
        //    Configuration.Modules.AbpWebApi().HttpConfiguration
        //        .EnableSwagger(c =>
        //        {
        //            c.SingleApiVersion("v1", "ABC.WebApi");
        //            c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
        //            c.UseFullTypeNameInSchemaIds();
        //        })
        //        .EnableSwaggerUi(c =>
        //        {
        //            c.InjectJavaScript(Assembly.GetExecutingAssembly(), "ABC.Web.Scripts.Swagger-Custom.js");
        //        });
        //}

        private static void EnableCors()
        {
            //This method enables cross origin request
            var cors = new EnableCorsAttribute("*", "*", "*");
            System.Web.Http.GlobalConfiguration.Configuration.EnableCors(cors);
        }
    }
}

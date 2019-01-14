using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyPhogGym.Web.Filters
{
    public class AcceessOriginalAttribute : ActionFilterAttribute, IExceptionFilter
    {
        public void InternalExuteAccessControle(HttpResponseBase response, HttpRequestBase request)
        {
            var header = response.Headers;
            var requestHeader = request.Headers;
            header.Set("Access-Control-Allow-Origin", requestHeader["Origin"] ?? "http://" + requestHeader["Host"]);
            header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            header.Set("Access-Control-Max-Age", "3600");
            header.Set("Access-Control-Allow-Headers", "*");
            header.Set("Access-Control-Allow-Credentials", "true");
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            InternalExuteAccessControle(filterContext.HttpContext.Response, filterContext.HttpContext.Request);
            base.OnActionExecuted(filterContext);
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            base.OnResultExecuting(filterContext);
        }

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            base.OnResultExecuted(filterContext);
        }

        public void OnException(ExceptionContext filterContext)
        {
            filterContext.Result = new JsonResult()
            {
                Data = new { Succeed = 0, Message = filterContext.Exception.Message },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
            filterContext.ExceptionHandled = true;
        }
    }
}
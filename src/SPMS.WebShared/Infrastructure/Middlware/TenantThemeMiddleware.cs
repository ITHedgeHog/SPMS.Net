﻿using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SPMS.WebShared.Infrastructure.Extensions;

namespace SPMS.WebShared.Infrastructure.Middlware
{
    public class TenantFilesMiddleware
    {
        private readonly RequestDelegate _next;


        public TenantFilesMiddleware(
            RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            
            var tenantContext = HttpContextExtensions.GetTenant(context);

            if (tenantContext != null)
            {
                //remove the prefix portion of the path
                var originalPath = context.Request.Path;
                var tenantFolder = tenantContext.Uuid.ToString();

                var paths = context.Request.Path.ToString().Split('/').ToList();
                if (paths.Any())
                {
                    paths.RemoveAt(0);
                    paths.RemoveAt(0);
                }
                var filePath = string.Join<string>('/', paths);
                var newPath = new PathString($"/tenantfiles/{tenantFolder}/{filePath}");

                context.Request.Path = newPath;

                if(_next != null)
                    await _next(context);

                //replace the original url after the remaining middleware has finished processing
                context.Request.Path = originalPath;
            }
        }
    }

    public class TenantThemeMiddleware
    {
        private readonly RequestDelegate _next;


        public TenantThemeMiddleware(
            RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var tenantContext = HttpContextExtensions.GetTenant(context);

            if (tenantContext != null)
            {
                //remove the prefix portion of the path
                var originalPath = context.Request.Path;
                var tenantFolder = tenantContext.Theme;

                var paths = context.Request.Path.ToString().Split('/').ToList();
                if (paths.Any())
                {
                    paths.RemoveAt(0);
                    paths.RemoveAt(0);
                }
                var filePath = string.Join<string>('/', paths);
                var newPath = new PathString($"/tenanttheme/{tenantFolder}/wwwroot/{filePath}");

                context.Request.Path = newPath;

                if (_next != null)
                    await _next(context);

                //replace the original url after the remaining middleware has finished processing
                context.Request.Path = originalPath;
            }
        }
    }
}

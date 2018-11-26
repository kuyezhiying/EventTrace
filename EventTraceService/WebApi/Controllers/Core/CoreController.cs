using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace EventTraceService.WebApi.Controllers
{
    public class CoreController : ApiController
    {
        /// <summary>
        /// Method for the home page to show the service is running
        /// </summary>
        /// <returns> the home page </returns>
        [HttpGet]
        public HttpResponseMessage Index()
        {
            var content = new StringContent("<html><body>API service is running.</body></html>");
            content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = content
            };
        }
    }
}
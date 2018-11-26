using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EventTraceService.Models.Events;

namespace EventTraceService.WebApi.Controllers
{
    public class EventController : ApiController
    {
        private static List<Event> events =
            new List<Event>()
            {
                new Event
                {
                    Title = "Event 1",
                    Summary = "Event trace web site is creating..."
                },
                new Event
                {
                    Title = "Event 2",
                    Summary = "Event trace web site is created!"
                }
            };

        public HttpResponseMessage GetAll()
        {
            return Request.CreateResponse(HttpStatusCode.OK, events);
        }

        public HttpResponseMessage Post(Event e)
        {
            if (e == null || !ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    "Invalid input");
            }

            events.Add(e);
            return Request.CreateResponse(HttpStatusCode.Created);
        }
    }
}
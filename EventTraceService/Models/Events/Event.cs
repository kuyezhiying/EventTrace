using System;
using System.ComponentModel.DataAnnotations;

namespace EventTraceService.Models.Events
{
    public class Event
    {
        [Required]
        public Guid Identifier { get; set; }

        public string Title { get; set; }

        public string Summary { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
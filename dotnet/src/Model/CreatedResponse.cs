using System.Text.Json.Serialization;

namespace Tournaments.Model
{
    public class CreatedResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        public CreatedResponse(string id)
        {
            Id = id;
        }
    }
}
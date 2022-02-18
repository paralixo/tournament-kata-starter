using System.Text.Json.Serialization;

namespace Tournaments.Model
{
    public class Tournament
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
namespace RedisBaza.Models
{
    public class Movie
    {
        public string ID { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string PictureUrl { get; set; }

        public double Rating { get; set; }

        public int NumberOfRatings { get; set; }

    }
}

namespace API.SecurityConfigurations {
	public class TokenConfigurations {
		public string Audience { get; set; } = null!;

		public string Issuer { get; set; } = null!;

		public int Seconds { get; set; }
	}
}

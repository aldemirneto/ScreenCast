namespace API.Models {
	public class BearerTokenViewModel {
		public DateTime CreatedAt { get; set; }

		public DateTime ExpiresAt { get; set; }

		public string AccessToken { get; set; } = null!;


		public BearerTokenViewModel(DateTime createdAt, DateTime expiresAt, string accessToken) {
			CreatedAt = createdAt;
			ExpiresAt = expiresAt;
			AccessToken = accessToken;
		}
	}
}

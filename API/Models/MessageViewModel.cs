namespace API.Models {
	public class MessageViewModel {
		public string Message { get; set; }

		public MessageViewModel(string message) {
			Message = message;
		}
	}
}

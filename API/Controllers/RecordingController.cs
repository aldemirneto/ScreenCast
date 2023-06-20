using API.Context;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class RecordingController : ControllerBase {
		private readonly PostgresContext _context;

		public RecordingController(PostgresContext context) {
			_context = context;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetRecordings() {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));

			var user = await _context.Users.FindAsync(userId) ?? throw new Exception("User not found");

			var recordings = await _context.Recordings.OrderByDescending(x => x.CreatedAt).Where(x => x.UserId == userId).Select(x => new {
				x.Id,
				x.CreatedAt
			}).ToListAsync();

			return Ok(recordings);
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> CreateFile([FromForm] IFormFile file) {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));

			var user = await _context.Users.FindAsync(userId) ?? throw new Exception("User not found");

			if (user.IsSubscribed == false && file.Length > 100) {
				return Unauthorized(new MessageViewModel("Assine o serviço para salvar vídeos com mais de 200MB."));
			}

			Guid videoId = Guid.NewGuid();

			string directory = $"{Environment.GetEnvironmentVariable("RecordingsBaseDir")}/{userId}";
			Directory.CreateDirectory(directory);

			string filePath = $"{directory}/{videoId}.webm";

			using Stream uploadedFileStream = file.OpenReadStream();
			using var fileStream = System.IO.File.Create(filePath);

			await uploadedFileStream.CopyToAsync(fileStream);

			var newRecording = new Recording {
				Id = videoId,
				UserId = userId,
				CreatedAt = DateTime.Now,
				FinishedAt = DateTime.Now,
			};

			_context.Recordings.Add(newRecording);
			await _context.SaveChangesAsync();

			return Ok(new { videoId });
		}
	}
}

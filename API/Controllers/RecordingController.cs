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
		private readonly ILogger<RecordingController> _logger;

		public RecordingController(PostgresContext context, ILogger<RecordingController> logger) {
			_context = context;
			_logger = logger;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetRecordings() {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));

			var recordings = await _context.Recordings.OrderByDescending(x => x.CreatedAt).Where(x => x.UserId == userId).Select(x => new {
				x.Id,
				x.CreatedAt
			}).ToListAsync();

			return Ok(recordings);
		}

		[HttpPost]
		[Authorize]
		[DisableRequestSizeLimit]
		public async Task<IActionResult> CreateFile([FromForm] IFormFile file) {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));

			var user = await _context.Users.FindAsync(userId) ?? throw new Exception("User not found");

			if (user.IsSubscribed == false && file.Length > 209715200) {
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

		[HttpDelete("{id:guid}")]
		[Authorize]
		public async Task<IActionResult> RemoveRecording(Guid id) {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));

			// Remove recording
			var recording = await _context.Recordings.Where(x => x.Id == id && x.UserId == userId).SingleOrDefaultAsync();
			if (recording is null) {
				return NotFound(new MessageViewModel("Gravação não encontrada."));
			}

			_context.Recordings.Remove(recording);
			await _context.SaveChangesAsync();

			try {
				// Remove file
				string filePath = $"{Environment.GetEnvironmentVariable("RecordingsBaseDir")}/{userId}/{id}.webm";
				System.IO.File.Delete(filePath);
			} catch (Exception e) {
				_logger.LogError(e, "Failed to delete recording file {id}.", recording.Id);
			}

			return NoContent();
		}
	}
}

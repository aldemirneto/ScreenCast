using API.Context;
using API.Entities;
using API.Models;
using API.SecurityConfigurations;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Eventing.Reader;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;

namespace API.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase {
		private readonly PostgresContext _context;
		private readonly SigningConfigurations _signingConfigurations;
		private readonly TokenConfigurations _tokenConfigurations;

		public UserController(PostgresContext context, SigningConfigurations signingConfigurations, TokenConfigurations tokenConfigurations) {
			_context = context;
			_signingConfigurations = signingConfigurations;
			_tokenConfigurations = tokenConfigurations;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] UserLogin userLogin) {
			var user = await _context.Users.Where(x => x.Email == userLogin.Email).SingleOrDefaultAsync();
			if (user is null) {
				return Unauthorized(new MessageViewModel("E-mail ou senha inválidos."));
			}

			if (!BCrypt.Net.BCrypt.EnhancedVerify(userLogin.Password, user.Password, HashType.SHA384)) {
				return Unauthorized(new MessageViewModel("E-mail ou senha inválidos."));
			}

			return Ok(TokenService.GenerateToken(user, _signingConfigurations, _tokenConfigurations));
		}

		[HttpPost]
		public async Task<IActionResult> Register([FromBody] UserRegister user) {
			bool userExists = await _context.Users.Where(x => x.Email == user.Email).AnyAsync();
			if (userExists) {
				return BadRequest(new MessageViewModel("E-mail já cadastrado."));
			}

			var newUser = new User {
				Id = Guid.NewGuid(),
				Email = user.Email,
				Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password, HashType.SHA384),
				CreatedAt = DateTime.Now,
				IsSubscribed = false
			};

			_context.Users.Add(newUser);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut]
		[Authorize]
		public async Task<IActionResult> SubscribeUser() {
			Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(ClaimTypes.NameIdentifier), "Cannot get user UUID from JWT."));
			var user = await _context.Users.FindAsync(userId) ?? throw new Exception("Usuário não encontrado.");

			if (user.IsSubscribed) {
				return BadRequest(new MessageViewModel("Usuário já está inscrito."));
			}

			user.IsSubscribed = true;
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}

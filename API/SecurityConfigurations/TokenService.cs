using API.Entities;
using API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace API.SecurityConfigurations {
	public class TokenService {
		public static BearerTokenViewModel GenerateToken(User user, SigningConfigurations signingConfigurations, TokenConfigurations tokenConfigurations) {
			DateTime creationDate = DateTime.UtcNow;
			DateTime expirationDate = creationDate + TimeSpan.FromSeconds(tokenConfigurations.Seconds);

			JwtSecurityTokenHandler tokenHandler = new();
			ClaimsIdentity identity = new(new Claim[] {
					new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
					new Claim(ClaimTypes.Role, user.IsSubscribed.ToString()),
					new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
				});

			SecurityTokenDescriptor tokenDescriptor = new() {
				Subject = identity,
				Issuer = tokenConfigurations.Issuer,
				Audience = tokenConfigurations.Audience,
				Expires = expirationDate,
				NotBefore = creationDate,
				SigningCredentials = signingConfigurations.SigningCredentials
			};

			SecurityToken createToken = tokenHandler.CreateToken(tokenDescriptor);
			string token = tokenHandler.WriteToken(createToken);

			return new BearerTokenViewModel(creationDate, expirationDate, token);
		}
	}
}

using API.Context;
using API.Controllers;
using API.Entities;
using API.Models;
using API.SecurityConfigurations;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using System.Linq;
using System.Threading.Tasks;

namespace API.Tests {
	public class UserControllerTests {

		private UserController _userController;
		private PostgresContext _postgresContext;

		private readonly DbContextOptions<PostgresContext> _dbContextOptions = new DbContextOptionsBuilder<PostgresContext>()
			.UseInMemoryDatabase(databaseName: "ScreenCast")
			.Options;

		private readonly Mock<SigningConfigurations> _signingConfigurationsMock = new();
		private readonly Mock<TokenConfigurations> _tokenConfigurationsMock = new();

		private readonly Fixture _fixture = new();

		[SetUp]
		public void Setup() {
			_postgresContext = new(_dbContextOptions);
			_userController = new(_postgresContext, _signingConfigurationsMock.Object, _tokenConfigurationsMock.Object);
		}

		[Test]
		public async Task Login_UserIsNull_ReturnsUnauthorizedAsync() {
			// Arrange
			var userLogin = _fixture.Create<UserLogin>();

			// Act
			var result = await _userController.Login(userLogin) as UnauthorizedObjectResult;

			// Assert
			result.Should().NotBeNull();
			result?.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
			result?.Value.Should().BeOfType<MessageViewModel>();

			var resultValue = result?.Value as MessageViewModel;
			resultValue?.Message.Should().Be("E-mail ou senha inválidos.");
		}

		[Test]
		public async Task Register_WithValidParameters_ReturnsNoContentAsync() {
			// Arrange
			var userRegister = _fixture.Create<UserRegister>();

			// Act
			var result = await _userController.Register(userRegister) as NoContentResult;

			// Assert
			result.Should().NotBeNull();
			result?.StatusCode.Should().Be(StatusCodes.Status204NoContent);
		}
	}
}
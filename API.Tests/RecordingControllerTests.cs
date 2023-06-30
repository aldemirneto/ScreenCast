using API.Context;
using API.Controllers;
using API.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Tests {
	public class RecordingControllerTests {
		private RecordingController _recordingController;
		private PostgresContext _postgresContext;

		private readonly DbContextOptions<PostgresContext> _dbContextOptions = new DbContextOptionsBuilder<PostgresContext>()
			.UseInMemoryDatabase(databaseName: "ScreenCast")
			.Options;

		private readonly Mock<ILogger<RecordingController>> _loggerMock = new();

		[SetUp]
		public void Setup() {
			_postgresContext = new(_dbContextOptions);
			_recordingController = new(_postgresContext, _loggerMock.Object);
		}

		[Test]
		public async Task Get_WithValidParameters_ReturnsOkAsync() {
			// Arrange
			_recordingController.ControllerContext = new ControllerContext() {
				HttpContext = new DefaultHttpContext() {
					User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {
						new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
					}))
				}
			};

			// Act
			var result = await _recordingController.GetRecordings() as OkObjectResult;

			// Assert
			result.Should().NotBeNull();
			result?.StatusCode.Should().Be(StatusCodes.Status200OK);
		}
	}
}

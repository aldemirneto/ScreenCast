using API.Context;
using API.SecurityConfigurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options => {
	options.AddDefaultPolicy(build => {
		build
			.WithOrigins(builder.Configuration.GetSection("CorsSettings:Origins").Get<string[]>())
			.AllowAnyMethod()
			.AllowAnyHeader()
			.AllowCredentials();
	});
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PostgresContext>(options => options.UseNpgsql(builder.Configuration["ConnectionStrings:Postgres"],
		opts => {
			opts.EnableRetryOnFailure(
				maxRetryCount: 10,
				maxRetryDelay: TimeSpan.FromSeconds(10),
				errorCodesToAdd: null
			);
			opts.MigrationsAssembly(typeof(PostgresContext).Assembly.FullName);
		}
	),
	ServiceLifetime.Transient
);

SigningConfigurations signingConfigurations = new();
builder.Services.AddSingleton(signingConfigurations);

TokenConfigurations tokenConfigurations = new();
new ConfigureFromConfigurationOptions<TokenConfigurations>(
	builder.Configuration.GetSection("TokenConfigurations"))
		.Configure(tokenConfigurations);
builder.Services.AddSingleton(tokenConfigurations);

builder.Services.AddAuthentication(x => {
	x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x => {
	x.RequireHttpsMetadata = false;
	x.SaveToken = true;
	x.TokenValidationParameters = new TokenValidationParameters {
		IssuerSigningKey = signingConfigurations.Key,
		ValidAudience = tokenConfigurations.Audience,
		ValidIssuer = tokenConfigurations.Issuer,
		ValidateIssuerSigningKey = true,
		ValidateLifetime = true,
		ClockSkew = TimeSpan.Zero
	};
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
	app.UseSwagger();
	app.UseSwaggerUI();
}


app.UseCors();

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions {
	FileProvider = new PhysicalFileProvider(Environment.GetEnvironmentVariable("RecordingsBaseDir")),
	RequestPath = "/recordings"
});

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();

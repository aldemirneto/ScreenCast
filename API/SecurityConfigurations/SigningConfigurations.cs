using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Security.Cryptography;

namespace API.SecurityConfigurations {
	public class SigningConfigurations {
		public SecurityKey Key { get; }

		public SigningCredentials SigningCredentials { get; }

		public SigningConfigurations() {
			using RSACryptoServiceProvider provider = new();
			provider.ImportFromPem(File.ReadAllText(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"/SecurityConfigurations/Private.key"));

			Key = new RsaSecurityKey(provider.ExportParameters(true));

			SigningCredentials = new SigningCredentials(Key, SecurityAlgorithms.RsaSha512Signature);
		}
	}
}

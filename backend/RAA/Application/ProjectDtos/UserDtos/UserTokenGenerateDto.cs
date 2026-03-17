using RAA.Domain.Models.AuthModels;

namespace RAA.Application.ProjectDtos.UserDtos
{
    public record UserTokenGenerateDto(string Email, Guid Id, UserRole UserRole);
}

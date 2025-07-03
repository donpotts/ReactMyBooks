using System.ComponentModel.DataAnnotations;

namespace MyBooks.Shared.Models;

public class ApplicationUserWithRolesDto : ApplicationUserDto
{
    public List<string>? Roles { get; set; }
}

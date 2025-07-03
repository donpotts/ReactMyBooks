using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace MyBooks.Shared.Models;

[DataContract]
public class Author
{
    [Key]
    [DataMember]
    public long? Id { get; set; }

    [DataMember]
    public string? Name { get; set; }

    [DataMember]
    public DateTime? BirthDate { get; set; }

    [DataMember]
    public string? ShortBio { get; set; }

    [DataMember]
    public List<Book>? Book { get; set; }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Attributes;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MyBooks.Data;
using MyBooks.Shared.Models;

namespace MyBooks.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableRateLimiting("Fixed")]
public class AuthorController(ApplicationDbContext ctx) : ControllerBase
{
    [HttpGet("")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<IQueryable<Author>> Get()
    {
        return Ok(ctx.Author.Include(x => x.Book));
    }

    [HttpGet("{key}")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> GetAsync(long key)
    {
        var author = await ctx.Author.Include(x => x.Book).FirstOrDefaultAsync(x => x.Id == key);

        if (author == null)
        {
            return NotFound();
        }
        else
        {
            return Ok(author);
        }
    }

    [HttpPost("")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Author>> PostAsync(Author author)
    {
        var record = await ctx.Author.FindAsync(author.Id);
        if (record != null)
        {
            return Conflict();
        }
    
        var book = author.Book;
        author.Book = null;

        await ctx.Author.AddAsync(author);

        if (book != null)
        {
            var newValues = await ctx.Book.Where(x => book.Select(y => y.Id).Contains(x.Id)).ToListAsync();
            author.Book = [..newValues];
        }

        await ctx.SaveChangesAsync();

        return Created($"/author/{author.Id}", author);
    }

    [HttpPut("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> PutAsync(long key, Author update)
    {
        var author = await ctx.Author.Include(x => x.Book).FirstOrDefaultAsync(x => x.Id == key);

        if (author == null)
        {
            return NotFound();
        }

        ctx.Entry(author).CurrentValues.SetValues(update);

        if (update.Book != null)
        {
            var updateValues = update.Book.Select(x => x.Id);
            author.Book ??= [];
            author.Book.RemoveAll(x => !updateValues.Contains(x.Id));
            var addValues = updateValues.Where(x => !author.Book.Select(y => y.Id).Contains(x));
            var newValues = await ctx.Book.Where(x => addValues.Contains(x.Id)).ToListAsync();
            author.Book.AddRange(newValues);
        }

        await ctx.SaveChangesAsync();

        return Ok(author);
    }

    [HttpPatch("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> PatchAsync(long key, Delta<Author> delta)
    {
        var author = await ctx.Author.Include(x => x.Book).FirstOrDefaultAsync(x => x.Id == key);

        if (author == null)
        {
            return NotFound();
        }

        delta.Patch(author);

        await ctx.SaveChangesAsync();

        return Ok(author);
    }

    [HttpDelete("{key}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(long key)
    {
        var author = await ctx.Author.FindAsync(key);

        if (author != null)
        {
            ctx.Author.Remove(author);
            await ctx.SaveChangesAsync();
        }

        return NoContent();
    }
}

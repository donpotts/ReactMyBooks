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
public class BookController(ApplicationDbContext ctx) : ControllerBase
{
    [HttpGet("")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<IQueryable<Book>> Get()
    {
        return Ok(ctx.Book.Include(x => x.Author).Include(x => x.Category));
    }

    [HttpGet("{key}")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> GetAsync(long key)
    {
        var book = await ctx.Book.Include(x => x.Author).Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == key);

        if (book == null)
        {
            return NotFound();
        }
        else
        {
            return Ok(book);
        }
    }

    [HttpPost("")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Book>> PostAsync(Book book)
    {
        var record = await ctx.Book.FindAsync(book.Id);
        if (record != null)
        {
            return Conflict();
        }
    
        var author = book.Author;
        book.Author = null;

        var category = book.Category;
        book.Category = null;

        await ctx.Book.AddAsync(book);

        if (author != null)
        {
            var newValues = await ctx.Author.Where(x => author.Select(y => y.Id).Contains(x.Id)).ToListAsync();
            book.Author = [..newValues];
        }

        if (category != null)
        {
            var newValues = await ctx.Category.Where(x => category.Select(y => y.Id).Contains(x.Id)).ToListAsync();
            book.Category = [..newValues];
        }

        await ctx.SaveChangesAsync();

        return Created($"/book/{book.Id}", book);
    }

    [HttpPut("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> PutAsync(long key, Book update)
    {
        var book = await ctx.Book.Include(x => x.Author).Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == key);

        if (book == null)
        {
            return NotFound();
        }

        ctx.Entry(book).CurrentValues.SetValues(update);

        if (update.Author != null)
        {
            var updateValues = update.Author.Select(x => x.Id);
            book.Author ??= [];
            book.Author.RemoveAll(x => !updateValues.Contains(x.Id));
            var addValues = updateValues.Where(x => !book.Author.Select(y => y.Id).Contains(x));
            var newValues = await ctx.Author.Where(x => addValues.Contains(x.Id)).ToListAsync();
            book.Author.AddRange(newValues);
        }

        if (update.Category != null)
        {
            var updateValues = update.Category.Select(x => x.Id);
            book.Category ??= [];
            book.Category.RemoveAll(x => !updateValues.Contains(x.Id));
            var addValues = updateValues.Where(x => !book.Category.Select(y => y.Id).Contains(x));
            var newValues = await ctx.Category.Where(x => addValues.Contains(x.Id)).ToListAsync();
            book.Category.AddRange(newValues);
        }

        await ctx.SaveChangesAsync();

        return Ok(book);
    }

    [HttpPatch("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> PatchAsync(long key, Delta<Book> delta)
    {
        var book = await ctx.Book.Include(x => x.Author).Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == key);

        if (book == null)
        {
            return NotFound();
        }

        delta.Patch(book);

        await ctx.SaveChangesAsync();

        return Ok(book);
    }

    [HttpDelete("{key}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(long key)
    {
        var book = await ctx.Book.FindAsync(key);

        if (book != null)
        {
            ctx.Book.Remove(book);
            await ctx.SaveChangesAsync();
        }

        return NoContent();
    }
}

using Microsoft.EntityFrameworkCore;
using AppOwnerPortal.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages
builder.Services.AddRazorPages();

builder.Services.AddAntiforgery(options => 
{
    options.Cookie.Name = "AppOwner.Antiforgery";
});

// Configure Database
builder.Services.AddDbContext<AppOwnerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "AppOwner.Identity";
        options.LoginPath = "/Login";
        options.AccessDeniedPath = "/Login";
    });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.Run();

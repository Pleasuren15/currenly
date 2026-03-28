using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// https://resend.com/docs/api-reference/emails/send-email
app.MapPost("/send-email", async (string subject, string htmlBody) =>
{
    var apiKey = builder.Configuration["ApiKeys:Resend"] ?? throw new NullReferenceException("Resend Key Cannot Be Null");
    IResend resend = ResendClient.Create(apiKey!);
    var response = await resend.EmailSendAsync(new EmailMessage()
    {
        From = "Currenly <onboarding@resend.dev>",
        To = "pleasuren15@gmail.com",
        Subject = subject,
        HtmlBody = htmlBody,
        ReplyTo = "pleasuren16@gmail.com"
    });

    return Results.Ok(response);
})
.WithName("SendEmail")
.WithSummary("Send a daily update email")
.WithDescription("Sends an email with the current date and update information using Resend service");

app.MapGet("/", () =>
{
    var html = @"
    <html>
        <head>
            <title>My API</title>
            <style>
                body { font-family: Arial; background:#0f172a; color:white; text-align:center; padding-top:80px; }
                h1 { font-size:48px; }
                p { font-size:20px; color:#cbd5f5; }
                a { color:#38bdf8; text-decoration:none; font-size:18px; }
            </style>
        </head>
        <body>
            <h1>Currenly.Api is Live</h1>
            <p>This api powers currenly.web</p>
            <a href=""/scalar/v1"">View Scalar</a>
        </body>
    </html>";

    return Results.Content(html, "text/html"); ;
})
.WithName("GetRoot")
.WithSummary("Health check endpoint")
.WithDescription("Returns a simple message to confirm that the API is running");

app.UseCors("AllowAll");
app.Run();

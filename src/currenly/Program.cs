using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// https://resend.com/docs/api-reference/emails/send-email
app.MapPost("/send-email", async () =>
{
    IResend resend = ResendClient.Create("re_xxxxxxxxxxxxxxxxxxxxx");
    var response = await resend.EmailSendAsync(new EmailMessage()
    {
        From = "Currently <onboarding@resend.dev>",
        To = "pleasuren15@gmail.com",
        Subject = $"Currently Update {DateTime.UtcNow:d}",
        HtmlBody = $"<p>Currently Update {DateTime.UtcNow:d}</p><p>Check out the latest updates on our website!</p>",
        ReplyTo = "pleasuren16@gmail.com"
    });

    return Results.Ok(response);
})
.WithName("SendEmail")
.WithSummary("Send a daily update email")
.WithDescription("Sends an email with the current date and update information using Resend service");

app.MapGet("/", () => "API is running")
.WithName("GetRoot")
.WithSummary("Health check endpoint")
.WithDescription("Returns a simple message to confirm that the API is running");

app.Run();

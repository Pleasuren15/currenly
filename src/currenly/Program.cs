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
    IResend resend = ResendClient.Create("re_ioXACVEV_FiJsGuXotVqrmYQA2eVrnYNm");
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

app.MapGet("/", () => "API is running")
.WithName("GetRoot")
.WithSummary("Health check endpoint")
.WithDescription("Returns a simple message to confirm that the API is running");

app.UseCors("AllowAll");
app.Run();

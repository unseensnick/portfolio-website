# Email Configuration for Portfolio Website

This document explains how to set up email functionality in your portfolio website using PayloadCMS and Nodemailer.

## Purpose

The email functionality is used for:

- Password reset emails
- New user verification emails
- Account notifications
- Contact form submissions (if implemented)

## Configuration Steps

### 1. Update Environment Variables

Add the following to your `.env` file:

```bash
# Email Configuration
EMAIL_FROM=noreply@yourportfolio.com
EMAIL_FROM_NAME=Portfolio Website

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### 2. SMTP Provider Options

You can use various SMTP providers:

#### Gmail

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-account@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not your regular password
```

#### SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### 3. Testing Email Functionality

To test if your email configuration is working:

1. go to your PayloadCMS admin panel
2. Click "Forgot Password"
3. Enter your email address
4. Check if you receive the password reset email

### 4. Development Environment

For development, if you don't configure SMTP settings, PayloadCMS will use Ethereal (a fake SMTP service) and log the email preview URLs to the console.

### 5. Customizing Email Templates

To customize email templates, you'll need to extend the Users collection. This is advanced functionality - refer to the PayloadCMS documentation for details.

## Troubleshooting

- **Emails not sending**: Check your SMTP credentials and server settings
- **Spam folder issues**: Make sure your FROM email domain has proper SPF and DKIM records
- **Gmail users**: You must use an App Password if you have 2FA enabled

## References

- [PayloadCMS Email Documentation](https://payloadcms.com/docs/email/overview)
- [Nodemailer Documentation](https://nodemailer.com/about/)

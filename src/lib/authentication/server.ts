import { env } from '$env/dynamic/private';

interface SendEmailOptions {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}

/**
 * Send an email using a webhook endpoint
 * Configure EMAIL_WEBHOOK in your .env file to point to your email service
 */
export const sendEmailAction = async (options: SendEmailOptions): Promise<void> => {
  const webhookUrl = env.EMAIL_WEBHOOK;
  
  if (!webhookUrl) {
    console.log('[Email Preview] To:', options.to);
    console.log('[Email Preview] Subject:', options.subject);
    console.log('[Email Preview] Description:', options.meta.description);
    console.log('[Email Preview] Link:', options.meta.link);
    console.log('[Email Preview] Set EMAIL_WEBHOOK in .env to enable real emails');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${options.subject}</h2>
            <p>${options.meta.description}</p>
            <p><a href="${options.meta.link}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Click Here</a></p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email: ' + response.statusText);
    }
    
    console.log('Email sent successfully to:', options.to);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

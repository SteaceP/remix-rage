interface SendEmailParams {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  
  export async function sendContactEmail(data: SendEmailParams) {
    const response = await fetch('https://form.coderage.pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const error = await response.json() as { details?: string };
      throw new Error(error.details || 'Failed to send email');
    }
  
    return response.json();
  }
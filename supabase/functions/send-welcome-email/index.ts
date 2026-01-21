import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore - npm import for Deno
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  full_name: string;
  temp_password?: string;
  login_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, temp_password, login_url }: WelcomeEmailRequest = await req.json();

    if (!email || !full_name || !login_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, full_name, login_url" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const passwordSection = temp_password 
      ? `
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600;">Your temporary password:</p>
          <code style="font-size: 18px; color: #3b82f6; background: #dbeafe; padding: 8px 16px; border-radius: 4px; display: inline-block;">${temp_password}</code>
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #6b7280;">Please change this password after your first login for security.</p>
        </div>
      `
      : '';

    const emailResponse = await resend.emails.send({
      from: "Staffinix <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Staffinix - Your Account is Ready!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0;">Welcome to Staffinix!</h1>
          </div>
          
          <p>Hi ${full_name},</p>
          
          <p>Your account has been created successfully. You're now part of the Staffinix platform!</p>
          
          ${passwordSection}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${login_url}" style="background-color: #3b82f6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Log In to Your Account
            </a>
          </div>
          
          <p>If you have any questions, don't hesitate to reach out to your administrator.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent by Staffinix. If you didn't expect this email, please contact your administrator.
          </p>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending welcome email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

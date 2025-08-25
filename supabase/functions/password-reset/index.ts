import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create regular client for auth operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const body = await req.json();
    const { action, email, token, newPassword, userId } = body;

    if (action === "forgot-password") {
      // Generate password reset for any user
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.headers.get("origin")}/auth?tab=reset-password`,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: "Password reset email sent" }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (action === "reset-password") {
      // Reset password using token
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: "Password updated successfully" }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (action === "create-staff-user") {
      // Create new staff user account
      const { email, password, firstName, lastName, role, phone } = body;

      // Create user account
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        },
        email_confirm: true
      });

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Create profile
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: newUser.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          phone
        });

      // Create staff record
      await supabaseAdmin
        .from("staff")
        .insert({
          user_id: newUser.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          role,
          status: 'Active'
        });

      // Assign role to user
      await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: newUser.user.id,
          role: role
        });

      return new Response(
        JSON.stringify({ 
          message: "Staff user created successfully",
          userId: newUser.user.id
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (action === "admin-reset-password") {
      // Admin reset - check if user is admin
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Authorization required" }),
          { 
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ error: "Invalid authorization" }),
          { 
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .single();

      if (roleError || roleData?.role !== "administrator") {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { 
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      
      // Update user password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: tempPassword }
      );

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Store password reset token
      const resetToken = crypto.randomUUID();
      await supabaseAdmin
        .from("password_reset_tokens")
        .insert({
          user_id: userId,
          token: resetToken,
          created_by: userData.user.id
        });

      return new Response(
        JSON.stringify({ 
          message: "Password reset successfully",
          temporaryPassword: tempPassword,
          resetToken
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in password-reset function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
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

    const { action, targetUserId, tenantId } = await req.json();

    // Verify admin authorization
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

    if (action === "start") {
      // End any existing active masquerade sessions for this admin
      await supabaseAdmin
        .from("masquerade_sessions")
        .update({ 
          is_active: false, 
          ended_at: new Date().toISOString() 
        })
        .eq("super_admin_id", userData.user.id)
        .eq("is_active", true);

      // Create new masquerade session
      const sessionToken = crypto.randomUUID();
      
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from("masquerade_sessions")
        .insert({
          super_admin_id: userData.user.id,
          target_user_id: targetUserId,
          tenant_id: tenantId,
          session_token: sessionToken,
          is_active: true
        })
        .select()
        .single();

      if (sessionError) {
        return new Response(
          JSON.stringify({ error: sessionError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Generate a login link for the target user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin
        .generateLink({
          type: 'magiclink',
          email: (await supabaseAdmin.auth.admin.getUserById(targetUserId)).data.user?.email || '',
          options: {
            redirectTo: `${req.headers.get("origin")}/dashboard?masquerade=${sessionToken}`
          }
        });

      if (linkError) {
        return new Response(
          JSON.stringify({ error: linkError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          sessionId: sessionData.id,
          sessionToken: sessionToken,
          loginUrl: linkData.properties?.action_link,
          message: "Masquerade session started"
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (action === "end") {
      // End masquerade session
      const { error: endError } = await supabaseAdmin
        .from("masquerade_sessions")
        .update({ 
          is_active: false, 
          ended_at: new Date().toISOString() 
        })
        .eq("super_admin_id", userData.user.id)
        .eq("is_active", true);

      if (endError) {
        return new Response(
          JSON.stringify({ error: endError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: "Masquerade session ended" }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (action === "check") {
      // Check if there's an active masquerade session
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from("masquerade_sessions")
        .select("*")
        .eq("super_admin_id", userData.user.id)
        .eq("is_active", true)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        return new Response(
          JSON.stringify({ error: sessionError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          isMasquerading: !!sessionData,
          session: sessionData 
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
    console.error("Error in masquerade function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
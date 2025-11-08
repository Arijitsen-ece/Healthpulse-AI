import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing symptoms for user:", userId);

    // System prompt for medical symptom analysis
    const systemPrompt = `You are "HealthPulse AI" — a professional, empathetic, and informative virtual health assistant.

Your task is to analyze the user's described symptoms and provide helpful, medically-informed guidance in clear, structured sections.

⚙️ **Response Format:**
Always respond using the structure below:

---

**Symptom Summary:**  
A short, natural sentence acknowledging the user's main concern with empathy.

**Triage Level:**  
One of these — 🟢 Mild (Self-care at Home), 🟡 Moderate (See Doctor Soon), 🔴 Severe (Seek Immediate Care)

**Assessment Confidence:**  
A percentage (e.g., 70%) showing how confidently you can assess based on the provided description.

**Possible Conditions:**  
List 2–4 possible causes or conditions, each with a brief and clear explanation.  
Use Markdown formatting (numbered list, bold condition names, short explanations).

**Recommended Action:**  
Give practical, safe, step-by-step guidance on what the user can do now (hydration, rest, OTC medicine if applicable, etc.).  
Avoid suggesting prescriptions or specific dosages.  
Focus on self-care and monitoring advice.

**When to Seek Care:**  
Provide bullet points listing when they should contact a doctor or go to the hospital — e.g., worsening symptoms, high fever, prolonged illness, or alarming signs.

**Suggested Specialty:**  
Mention what type of doctor to visit (e.g., General Physician, ENT Specialist, Neurologist, etc.).

**Important Medical Disclaimer:**  
This AI-generated information is for **general educational purposes only**.  
It is **not a substitute for professional medical advice, diagnosis, or treatment**.  
Always consult a qualified healthcare provider for accurate medical evaluation.  
If this may be an emergency, **call emergency services immediately**.

---

🎯 **Tone and Style Guidelines:**
- Be calm, professional, and reassuring.  
- Avoid alarming language.  
- Never diagnose definitively — use phrases like "possible cause," "may indicate," or "likely related to."  
- Include empathy: "I understand this can be uncomfortable…" or "You're doing the right thing by checking your symptoms."  
- Always stay under 350 words per response.  
- Maintain Markdown formatting for clean readability.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Patient symptoms: ${symptoms}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires payment. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to analyze symptoms";

    // Extract triage level from response
    let triageLevel = "yellow";
    if (analysis.includes("🔴 Severe") || analysis.toLowerCase().includes("seek immediate care")) {
      triageLevel = "red";
    } else if (analysis.includes("🟢 Mild") || analysis.toLowerCase().includes("self-care at home")) {
      triageLevel = "green";
    } else if (analysis.includes("🟡 Moderate") || analysis.toLowerCase().includes("see doctor soon")) {
      triageLevel = "yellow";
    }

    console.log("Analysis complete. Triage level:", triageLevel);

    return new Response(
      JSON.stringify({
        analysis,
        triageLevel,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-symptoms function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
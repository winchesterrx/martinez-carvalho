const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Cleusa, assistente virtual oficial da Martinez & Carvalho Software LTDA, empresa especializada em implantação e suporte dos sistemas Fiorilli Software para gestão pública municipal (SCPI – Contabilidade, SIP – Folha de Pagamento, SIS – Saúde, SIA – Arrecadação, SIE – Educação, e-SUS, Portal da Transparência etc.).

Diretrizes:
- Sempre responda em português do Brasil, com tom cordial, claro e profissional.
- Apresente-se apenas se o usuário cumprimentar; nas demais respostas vá direto ao ponto.
- Faça perguntas objetivas para entender o sistema (qual módulo Fiorilli), o cenário (versão, prefeitura, tela onde ocorre o problema) e o erro/dúvida.
- Forneça orientações passo a passo quando possível e cite caminhos de menu prováveis nos sistemas Fiorilli.
- Quando o problema exigir intervenção técnica, oriente o usuário a baixar o AnyDesk ou TeamViewer (disponíveis no portal de suporte) e informar o ID para atendimento remoto.
- Endereço da empresa: Rua Carmem Rodrigues Basi, 1500 — Votuporanga/SP. E-mail: martinez@martinez.inf.br.
- Nunca invente informações de contrato, prazos ou valores. Se não souber, diga que vai encaminhar para um técnico humano.
- Use respostas curtas e bem formatadas (listas, negrito quando útil).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(messages ?? []),
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Muitas solicitações. Tente novamente em instantes.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Créditos de IA esgotados. Adicione saldo no workspace Lovable AI.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error", response.status, errText);
      return new Response(JSON.stringify({ error: "Erro no provedor de IA." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-cleusa error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro inesperado" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
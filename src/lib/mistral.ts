type MistralMessage={role: "system" | "user" | "assistant"; content: string};

export async function getMistralEmbeddings(texts:string[]): Promise<number[][]>{
    const res = await fetch("https://api.mistral.ai/v1/embeddings", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY ?? ""}`,
        },
        body: JSON.stringify({
            model: "mistral-embed",
            input: texts,
        }),
    })

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Mistral embeddings error ${res.status}: ${text}`);
    }
    
    const data = (await res.json()) as any;
    return data.data.map((d: any) => d.embedding as number[]);
}

export async function chatMistral(messages: MistralMessage[]): Promise<string> {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "open-mistral-7b",
      messages,
      temperature: 0.4,
    }),
  });
 
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mistral chat error ${res.status}: ${text}`);
  }
 
  const data = (await res.json()) as any;
  return data.choices[0].message.content as string;
}
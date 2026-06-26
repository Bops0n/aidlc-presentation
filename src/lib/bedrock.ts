import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  token: { token: process.env.AWS_BEARER_TOKEN_BEDROCK! },
});

export async function invokeBedrockWithTool(
  systemPrompt: string,
  userPrompt: string,
  tool: { name: string; description: string; input_schema: Record<string, unknown> }
): Promise<Record<string, any>> {
  const command = new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "us.amazon.nova-pro-v1:0",
    system: [{ text: systemPrompt }],
    messages: [
      {
        role: "user",
        content: [{ text: userPrompt }],
      },
    ],
    toolConfig: {
      tools: [
        {
          toolSpec: {
            name: tool.name,
            description: tool.description,
            inputSchema: {
              json: tool.input_schema as any,
            },
          },
        },
      ],
      toolChoice: { tool: { name: tool.name } },
    },
    inferenceConfig: {
      maxTokens: 8192,
      temperature: 0.7,
    },
  });

  const response = await client.send(command);

  // Extract tool use from response
  const toolUseBlock = response.output?.message?.content?.find(
    (block) => "toolUse" in block
  );

  const input = (toolUseBlock as any)?.toolUse?.input;

  if (!input) {
    throw new Error("AI did not return structured output");
  }

  return input as Record<string, any>;
}

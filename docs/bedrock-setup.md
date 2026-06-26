# Amazon Bedrock Setup Guide

## Overview

โปรเจคนี้ใช้ Amazon Bedrock เรียก Claude Sonnet 4.5 สำหรับ AI slide generation
เอกสารนี้อธิบายวิธี setup ตั้งแต่เริ่มต้น

---

## ข้อมูล Model

| Item | Value |
|------|-------|
| Model | Claude Sonnet 4.5 |
| Model ID | `anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Cross-Region (US) | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Context Window | 200K tokens |
| Max Output | 64K tokens |
| Pricing | $3.00 / 1M input tokens, $15.00 / 1M output tokens |
| API Version | `bedrock-2023-05-31` |

---

## Step 1: สร้าง AWS Account

ถ้ายังไม่มี account ไปสมัครที่ https://portal.aws.amazon.com/billing/signup

---

## Step 2: Enable Model Access ใน Bedrock Console

1. ไปที่ [Amazon Bedrock Console](https://console.aws.amazon.com/bedrock)
2. เลือก Region ที่ต้องการ (แนะนำ `us-east-1`)
3. ไปที่ **Model access** (เมนูซ้าย)
4. คลิก **Manage model access**
5. ค้นหา **Anthropic** → เลือก **Claude Sonnet 4.5**
6. คลิก **Request model access** → รอ approve (ปกติได้ทันที)

> หมายเหตุ: ถ้าใช้ Cross-Region inference (us.) ต้อง enable ใน region ที่เป็น entry point

---

## Step 3: สร้าง Credentials

### Option A: Bedrock API Key (แนะนำสำหรับ development — ง่ายสุด)

1. ไปที่ [Amazon Bedrock Console](https://console.aws.amazon.com/bedrock)
2. เมนูซ้าย **Discover → API keys**
3. เลือก **Long-term API keys** → **Generate long-term API key**
4. กำหนดอายุ (เช่น 30 วัน)
5. Copy key ที่ได้ (format: `bedrock-api-key-YmVk...`)

> Key นี้ใช้เป็น Bearer Token — ไม่ต้อง setup IAM User/Role เอง
> AWS จะสร้าง IAM user พร้อม `AmazonBedrockLimitedAccess` policy ให้อัตโนมัติ

### Option B: IAM User + Access Key (สำหรับ development ที่ต้องการ control มากขึ้น)

1. ไปที่ [IAM Console](https://console.aws.amazon.com/iam)
2. สร้าง User ใหม่ หรือใช้ user ที่มีอยู่
3. Attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-5-20250929-v1:0"
      ]
    }
  ]
}
```

4. สร้าง Access Key ที่ **Security credentials** → **Create access key**
5. เก็บ `Access Key ID` และ `Secret Access Key`

### Option C: IAM Role (สำหรับ production — Docker/EC2/ECS)

สร้าง IAM Role พร้อม policy เดียวกัน แล้ว attach กับ compute resource
ไม่ต้องใช้ Access Key — SDK จะ auto-resolve credentials จาก instance metadata

---

## Step 4: ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` (ห้าม commit):

```env
# Amazon Bedrock API Key (Bearer Token)
AWS_BEARER_TOKEN_BEDROCK=bedrock-api-key-YmVkcm9jay5hbWF6b2...
AWS_REGION=us-east-1

# Model Configuration
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-5-20250929-v1:0

# (optional) ใช้ Cross-Region สำหรับ throughput ที่สูงขึ้น
# BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

### Bedrock API Key มี 2 ประเภท

| ประเภท | อายุ | เหมาะกับ |
|--------|------|---------|
| Short-term | ≤ 12 ชม. | ทดสอบเร็วๆ, ปลอดภัยกว่า |
| Long-term | กำหนดเอง (30/90 วัน) | Development ระยะยาว |

> Short-term key จะมี STS session token ฝังอยู่ใน key (ขนาดใหญ่ base64)
> Long-term key จะมี format สั้นกว่าและ set อายุเองได้

### สร้าง Key ที่ไหน

Bedrock Console → เมนูซ้าย **Discover → API keys** → เลือก Short-term หรือ Long-term

### (ทางเลือก) ใช้ IAM Access Key แทน

ถ้าต้องการใช้แบบ Access Key/Secret:

```env
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-5-20250929-v1:0
```

---

## Step 5: Install SDK

```bash
pnpm add @aws-sdk/client-bedrock-runtime
```

---

## Step 6: ตัวอย่าง Code (TypeScript)

### วิธี A: ใช้ Bedrock API Key (Bearer Token) — แนะนำสำหรับ dev

```typescript
// src/lib/bedrock.ts
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  token: { token: process.env.AWS_BEARER_TOKEN_BEDROCK! },
});

export async function invokeClaudeSonnet(prompt: string, systemPrompt?: string) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 8192,
    messages: [
      { role: 'user', content: prompt },
    ],
    ...(systemPrompt && { system: systemPrompt }),
  });

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-5-20250929-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody;
}
```

### วิธี B: ใช้ IAM Access Key/Secret

```typescript
// src/lib/bedrock.ts
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// ... เหมือนวิธี A ต่อจากนี้
```

### ตัวอย่างใช้กับ Tool Use (structured JSON output)

```typescript
export async function generateSlidesStructured(prompt: string) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 16384,
    system: 'You are a presentation layout architect...',
    messages: [
      { role: 'user', content: prompt },
    ],
    tools: [
      {
        name: 'create_presentation',
        description: 'สร้าง structured presentation data',
        input_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            theme: {
              type: 'object',
              properties: {
                backgroundColor: { type: 'string' },
                textColor: { type: 'string' },
                accentColor: { type: 'string' },
                headingFont: { type: 'string' },
                bodyFont: { type: 'string' },
              },
              required: ['backgroundColor', 'textColor', 'accentColor', 'headingFont', 'bodyFont'],
            },
            slides: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slideTitle: { type: 'string' },
                  layout: { type: 'string', enum: ['title', 'two-column', 'image-focus', 'content'] },
                  elements: { type: 'array' },
                  notes: { type: 'string' },
                },
              },
            },
          },
          required: ['title', 'theme', 'slides'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'create_presentation' },
  });

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-5-20250929-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  // Extract tool use result
  const toolUseBlock = responseBody.content.find(
    (block: any) => block.type === 'tool_use'
  );

  return toolUseBlock?.input; // structured presentation data
}
```

---

## Step 7: ใช้ใน Route Handler

```typescript
// src/app/api/generate-slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateSlidesStructured } from '@/lib/bedrock';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: 'Prompt is required' } },
      { status: 400 }
    );
  }

  try {
    const presentation = await generateSlidesStructured(prompt);
    return NextResponse.json({ data: presentation });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: 'Failed to generate slides' } },
      { status: 500 }
    );
  }
}
```

---

## Troubleshooting

| ปัญหา | สาเหตุ | แก้ไข |
|--------|--------|-------|
| `AccessDeniedException` | ยังไม่ enable model access | ไป Bedrock Console → Model access → Request access |
| `ValidationException: model not found` | Region ไม่รองรับ | ใช้ `us-east-1` หรือ cross-region ID (`us.anthropic...`) |
| `ThrottlingException` | Rate limit | ใส่ retry logic หรือ request quota increase |
| `ExpiredTokenException` | Credentials หมดอายุ | Refresh credentials หรือใช้ IAM Role |

---

## Region Recommendations

- **Development**: `us-east-1` (N. Virginia) — มี model เยอะที่สุด
- **Production (Cross-Region)**: ใช้ prefix `us.` เพื่อ load balance ข้าม regions ใน US
- **Asia-Pacific**: ใช้ Global Cross-Region (`global.anthropic...`) สำหรับ routing อัตโนมัติ

---

## Security Best Practices

1. **ห้าม** hardcode credentials ใน source code
2. ใช้ `.env.local` สำหรับ dev (อยู่ใน .gitignore)
3. Production ใช้ IAM Role แทน Access Keys
4. จำกัด IAM policy ให้เฉพาะ `InvokeModel` action เท่านั้น
5. ใช้ `bedrock:InvokeModelWithResponseStream` เฉพาะเมื่อต้องการ streaming

---

## Links

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/)
- [Claude Sonnet 4.5 Model Card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4-5.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

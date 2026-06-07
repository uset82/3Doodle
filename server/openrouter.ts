import type { ChatMessage } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const CHAT_MODEL = process.env.OPENROUTER_CHAT_MODEL || "moonshotai/kimi-k2.6:free";
const IMAGE_MODEL = process.env.OPENROUTER_IMAGE_MODEL || "sourceful/riverflow-v2.5-pro:free";

const CHAT_SYSTEM_PROMPT =
  "You are 3Doodle's friendly drawing buddy for children. Keep replies short, encouraging, safe, and easy to understand. Help with drawing ideas, simple steps, colors, and what to try next. Never mention API providers or internal model names.";

const OBJECT_DETECTION_PROMPT =
  "Look at this child's doodle and identify the main everyday object. Reply with exactly one simple lowercase noun, such as apple, dog, cat, flower, house, car, sun, or tree. If it is unclear, reply with object.";

export class OpenRouterConfigError extends Error {
  constructor(envVarName: string) {
    super(`Missing required environment variable: ${envVarName}`);
    this.name = "OpenRouterConfigError";
  }
}

type OpenRouterImage = {
  type?: string;
  image_url?: {
    url?: string;
  };
};

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<unknown> | null;
      images?: OpenRouterImage[];
    };
  }>;
  error?: {
    message?: string;
    metadata?: {
      raw?: string;
    };
  };
};

const fallbackObjects = [
  "apple",
  "dog",
  "cat",
  "flower",
  "house",
  "tree",
  "car",
  "sun",
  "moon",
  "ball",
];

const objectAliases: Record<string, string[]> = {
  apple: ["apple", "apples", "manzana", "manzanas"],
  ball: ["ball", "balls", "pelota", "pelotas", "balon", "balones"],
  car: ["car", "cars", "auto", "autos", "coche", "coches", "carro", "carros"],
  cat: ["cat", "cats", "kitten", "kittens", "gato", "gatos", "gata", "gatas", "gatito", "gatita"],
  dog: ["dog", "dogs", "puppy", "puppies", "perro", "perros", "perrito", "perrita"],
  flower: ["flower", "flowers", "flor", "flores"],
  house: ["house", "houses", "home", "casa", "casas"],
  moon: ["moon", "luna"],
  rainbow: ["rainbow", "rainbows", "arcoiris"],
  rocket: ["rocket", "rockets", "cohete", "cohetes"],
  sun: ["sun", "sol", "solecito"],
  tree: ["tree", "trees", "arbol", "arboles"],
};

function getApiKey(envVarName: string): string {
  const apiKey = process.env[envVarName] || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new OpenRouterConfigError(envVarName);
  }

  return apiKey;
}

function sanitizeObjectType(value: string | undefined): string {
  const words = value
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  return words?.join(" ") || "object";
}

function getFallbackObject(): string {
  return fallbackObjects[Math.floor(Math.random() * fallbackObjects.length)] ?? "object";
}

function getHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "3Doodle",
  };
}

async function postOpenRouterChatCompletion(payload: Record<string, unknown>, apiKey: string) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as OpenRouterChatResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.metadata?.raw
        || data.error?.message
        || `OpenRouter request failed with status ${response.status}`,
    );
  }

  return data;
}

export function getFallbackChatReply(messages: ChatMessage[]): string {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const text = latestUserMessage?.content.toLowerCase().trim() || "";
  const objectType = getRequestedImageObject(messages);

  if (objectType) {
    return `Great idea! Draw a big simple ${objectType} outline first, add one or two fun details, then tap Generate 3D.`;
  }

  if (/\b(hi|hello|hey|hola)\b/.test(text)) {
    return "Hi! Try a simple apple, cat, rocket, flower, or sunny house. Big outlines work best.";
  }

  if (/\b(idea|draw|doodle|what|suggest)\b/.test(text)) {
    return "Try a rocket with a round window, a flower with five petals, or a house with a big door.";
  }

  if (/\b(color|colour|paint|rainbow)\b/.test(text)) {
    return "Pick two bright colors: one for the main shape and one for small details like dots, stripes, or stars.";
  }

  return "That sounds fun. Start with one big shape, add a few clear details, then make it 3D when you are ready.";
}

export async function chatWithOpenRouter(messages: ChatMessage[]): Promise<string> {
  const result = await postOpenRouterChatCompletion({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: CHAT_SYSTEM_PROMPT,
      },
      ...messages.map((message) => ({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content,
      })),
    ],
    max_tokens: 220,
    temperature: 0.7,
    stream: false,
  }, getApiKey("OPENROUTER_CHAT_API_KEY"));

  const content = result.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

function stripPoliteAndFillerWords(value: string): string {
  return value
    .replace(/\b(?:please|pls|por favor|gracias|thanks|thank you)\b/g, " ")
    .replace(/\b(?:for me|para mi|para mí)\b/g, " ")
    .replace(/\b(?:in 3d|en 3d|3d|model|modelo|image|imagen|picture|foto)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCanonicalObject(candidate: string): string | undefined {
  const normalizedCandidate = sanitizeObjectType(candidate);
  const candidateWords = new Set(normalizedCandidate.split(/\s+/));

  for (const [objectType, aliases] of Object.entries(objectAliases)) {
    if (aliases.some((alias) => candidateWords.has(alias))) {
      return objectType;
    }
  }

  return normalizedCandidate === "object" ? undefined : normalizedCandidate;
}

export function getRequestedImageObject(messages: ChatMessage[]): string | undefined {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return undefined;
  }

  const text = latestUserMessage.content
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const directRequestPatterns = [
    /\b(?:can you|could you|please)\s+(?:draw|paint|generate|make|create|render|show)\s+(?:me\s+)?(?:a|an|the)?\s*(.+)\b/,
    /\b(?:draw|paint|generate|make|create|render|show)\s+(?:me\s+)?(?:a|an|the)?\s*(.+)\b/,
    /\b(?:pinta|pintame|dibujame|dibuja|genera|generame|crea|haz|muestra|muestrame)\s+(?:un|una|el|la|los|las)?\s*(.+)\b/,
    /\b(?:quiero|quisiera)\s+(?:un|una|el|la)?\s*(?:dibujo|modelo|imagen|foto)?\s*(?:de)?\s*(.+)\b/,
  ];

  for (const pattern of directRequestPatterns) {
    const match = text.match(pattern);
    const candidate = stripPoliteAndFillerWords(match?.[1] ?? "");
    const objectType = getCanonicalObject(candidate);

    if (objectType) {
      return objectType;
    }
  }

  return undefined;
}

export async function detectObjectInDrawing(imageData: string): Promise<string> {
  try {
    const result = await postOpenRouterChatCompletion(
      {
        model: CHAT_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: OBJECT_DETECTION_PROMPT,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
        max_tokens: 20,
        temperature: 0,
        stream: false,
      },
      getApiKey("OPENROUTER_CHAT_API_KEY"),
    );

    const content = result.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : undefined;

    return sanitizeObjectType(text);
  } catch (error) {
    if (error instanceof OpenRouterConfigError) {
      throw error;
    }

    console.error("Error detecting object with OpenRouter:", error);
    return getFallbackObject();
  }
}

export async function generate3DModel(objectType: string, sourceImageData?: string): Promise<string> {
  const cleanObjectType = sanitizeObjectType(objectType);
  const prompt = sourceImageData
    ? `Use the attached child's sketch as the source image. Infer the main object from the black line drawing, then transform it into a polished, recognizable 3D toy-like object for a child-friendly drawing app. Preserve the sketch's core shape and composition, but make the result clean, centered, colorful, rounded, and easy to recognize on a plain white studio background. Do not include hands, pencils, text, UI, or extra objects.`
    : `Create a photorealistic 3D model of a ${cleanObjectType} for a child-friendly drawing app. Center the object on a clean white studio background with soft lighting, smooth rounded materials, vibrant colors, and a gentle cartoon charm. Make the ${cleanObjectType} clear and recognizable as the only main subject.`;
  const content = sourceImageData
    ? [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image_url",
          image_url: {
            url: sourceImageData,
          },
        },
      ]
    : prompt;

  try {
    const result = await postOpenRouterChatCompletion(
      {
        model: IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content,
          },
        ],
        modalities: ["image"],
        reasoning: {
          effort: "low",
        },
        image_config: {
          aspect_ratio: "1:1",
          image_size: "1K",
          background_mode: "solid",
          background_hex_color: "#ffffff",
          scoring_prompt:
            sourceImageData
              ? "Prefer faithful sketch interpretation, a single clean 3D object, strong silhouette, kid-friendly materials, crisp edges, and even studio lighting."
              : "Prefer a single clean object, strong silhouette, kid-friendly materials, crisp edges, and even studio lighting.",
        },
        stream: false,
      },
      getApiKey("OPENROUTER_IMAGE_API_KEY"),
    );

    const imageUrl = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("OpenRouter did not return an image");
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof OpenRouterConfigError) {
      throw error;
    }

    console.error("Error generating 3D model with OpenRouter:", error);
    throw new Error(error instanceof Error ? error.message : "Riverflow generation failed");
  }
}

export function isOpenRouterConfigError(error: unknown): error is OpenRouterConfigError {
  return error instanceof OpenRouterConfigError;
}

import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateProductShotParams {
  productImage: UploadedImage;
  referenceImage: UploadedImage;
  userPrompt?: string;
  aspectRatio?: string;
}

export const generateProductShot = async ({
  productImage,
  referenceImage,
  userPrompt = "",
  aspectRatio = "1:1",
}: GenerateProductShotParams): Promise<string> => {
  try {
    const parts = [
      {
        inlineData: {
          mimeType: productImage.mimeType,
          data: productImage.base64Data,
        },
      },
      {
        inlineData: {
          mimeType: referenceImage.mimeType,
          data: referenceImage.base64Data,
        },
      },
      {
        text: `
          You are an expert professional product photographer and editor.
          
          Task:
          Create a high-quality, professional product shot.
          
          Inputs:
          1. The first image provided is the PRODUCT.
          2. The second image provided is the STYLE REFERENCE.
          
          Instructions:
          - Generate a SINGLE final image.
          - Place the PRODUCT from the first image into a scene that matches the lighting, composition, mood, and background style of the STYLE REFERENCE (second image).
          - CRITICAL: The PRODUCT itself must look identical to the original photo. Do not alter the product's shape, label, logos, or core features. Only change the lighting interacting with it to match the scene.
          - ${userPrompt ? `Additional User Instructions: ${userPrompt}` : ''}
          - The output must be photorealistic and high resolution.
        `,
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    let generatedImageUrl = "";

    if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content && content.parts) {
            for (const part of content.parts) {
                if (part.inlineData) {
                    const base64Data = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || "image/png";
                    generatedImageUrl = `data:${mimeType};base64,${base64Data}`;
                    break; 
                }
            }
        }
    }

    if (!generatedImageUrl) {
      throw new Error("No image was generated. The model might have returned only text.");
    }

    return generatedImageUrl;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
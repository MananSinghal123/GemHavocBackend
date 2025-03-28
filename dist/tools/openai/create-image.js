"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImage = createImage;
const openai_1 = __importDefault(require("openai"));
/**
 * Generate an image using OpenAI's DALL-E
 * @param agent MoveAgentKit instance
 * @param prompt Text description of the image to generate
 * @param size Image size ('256x256', '512x512', or '1024x1024') (default: '1024x1024')
 * @param n Number of images to generate (default: 1)
 * @returns Object containing the generated image URLs
 */
async function createImage(agent, prompt, size = "1024x1024", n = 1) {
    try {
        const apiKey = agent.config.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("No OPENAI_API_KEY in config");
        }
        const openai = new openai_1.default({ apiKey });
        const response = await openai.images.generate({
            prompt,
            n,
            size,
        });
        return {
            images: response.data.map((img) => img.url),
        };
    }
    catch (error) {
        throw new Error(`Image generation failed: ${error.message}`);
    }
}

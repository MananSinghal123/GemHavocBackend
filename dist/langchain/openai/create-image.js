"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAICreateImageTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class OpenAICreateImageTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "openai_create_image";
        this.description = `
    Generate an image using OpenAI's DALL-E

    Inputs ( input is a JSON string ):
    prompt: string, Text description of the image to generate (required)
    size: string, Image size ('256x256', '512x512', or '1024x1024') (default: '1024x1024')
    n: number, Number of images to generate (default: 1)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const response = await this.agent.createImageWithOpenAI(parsedInput.prompt, parsedInput.size, parsedInput.n);
            return JSON.stringify({
                status: "success",
                response,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.OpenAICreateImageTool = OpenAICreateImageTool;

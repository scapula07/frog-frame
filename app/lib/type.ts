
export interface Txt2imgInput {
    model_id: string;
    prompt: string;
    height: number;
    width: number;
    guidance_scale: number;
    safety_check: boolean;
    num_inference_steps: number;
    num_images_per_prompt: number;
  }

export interface GenerationOutput {
    id: string;
    status: string;
    outputs: Array<{
      id: string;
      url: string;
      nsfw: boolean;
      seed?: number;
    }>;
  }
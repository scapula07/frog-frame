import { Txt2imgInput,GenerationOutput } from "./type";
import axios, { AxiosResponse } from 'axios';

export class SDAPI {
    public async txt2img(prompt: string): Promise<GenerationOutput> {
        const url = 'https://dream-gateway.livepeer.cloud/text-to-image';
        const body:Txt2imgInput = {
            model_id:"SG161222/RealVisXL_V4.0_Lightning",
            prompt:prompt,
            guidance_scale: 2,
            width: 1024 ,
            height: 512,
            safety_check:true,
            num_inference_steps: 6,
            num_images_per_prompt: 2,
          };


        try {
             const response = await axios.post(url,body, {
                headers: {
                  'Authorization': `Bearer <token>`, 
                  'Content-Type': 'application/json',
                },
                timeout: 40000
              });
              const data = response.data;
              console.log(data,"data")
              
              if (data && data.images) {
                return {
                  id: data.id,
                  status: data.status,
                  outputs: data.images.map((item: { url: string, nsfw: boolean, seed?: number }, index: number) => ({
                    id: `${data.id}:${index}`,
                    url: item.url,
                    nsfw: item.nsfw,
                    seed: item.seed
                  }))
                };
              } else {
                throw new Error('Empty data');
              }
        
            
          }catch(error){
                let errorMessage = 'Unknown error';
                if (axios.isAxiosError(error) && error.response) {
                const data = error.response.data;
                errorMessage = data.error?.message || '';
                }
                throw new Error(`Provider Error: ${errorMessage}`);
        
          }
      
    }

}
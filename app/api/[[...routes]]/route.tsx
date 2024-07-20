/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { createSystem } from 'frog/ui'
import { SDAPI } from '@/app/lib'
import { Txt2imgInput } from '@/app/lib/type'



const app = new Frog({
  title:"frame",
  assetsPath: '/',
  basePath: '/api',
})



app.frame('/', (c) => {
  return c.res({
    action:'/prompt',
    image: `https://frog-frame-coral.vercel.app/background.png`,
    imageAspectRatio:'1:1',
    intents: [<Button value="">Let's Start</Button>]  
  })
})


app.frame('/prompt', (c) => {
 
  return c.res({
    action:'/mint',
    image: `https://frog-frame-coral.vercel.app/background.png`,
    imageAspectRatio:'1.91:1',
    intents: [
      <TextInput placeholder="A cool cat on the beach..." />,
      <Button value="">Generate</Button>
      ]  
  })
})


app.frame('/mint', async(c) => {
  const api= new SDAPI()
  const result = await api.txt2img(c?.frameData?.inputText || "");
  return c.res({
    action:'/prompt',
    image: result?.outputs[0]?.url,
    imageAspectRatio:'1:1',
    intents: [
      <Button value="">Regenerate</Button>,
      <Button value="">Mint</Button>
    ]  
  })
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { createSystem } from 'frog/ui'
import { SDAPI } from '@/app/lib'
import { Txt2imgInput } from '@/app/lib/type'

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem()


const app = new Frog({
  title:"frame",
  assetsPath: '/',
  basePath: '/api',
  ui: { vars }
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
    action:'/inspect',
    image:(
      <Box></Box>
      
    ),
    imageAspectRatio:'1:1',
    intents: [
      <TextInput placeholder="A cool cat on the beach..." />,
      <Button value="">Generate</Button>
      ]  
  })
})


app.frame('/inspect', async(c) => {
  const api= new SDAPI()
  const result = await api.txt2img(c?.frameData?.inputText || "");
  return c.res({
    image: result?.outputs[0]?.url,
    imageAspectRatio:'1:1',
    intents: [
      <Button value="">Regenerate</Button>,
      <Button value="">Mint</Button>
    ]  
  })
})



// app.transaction('/mint', (c) => {
//   const { inputText } = c
//   return c.contract({
//   })
// })


app.frame('/finish', (c) => {
  return c.res({
    action:'/prompt',
    image: `https://frog-frame-coral.vercel.app/background2.png`,
    imageAspectRatio:'1:1',
    intents: [<Button value="">Share</Button>]  
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

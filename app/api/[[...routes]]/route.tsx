/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { createSystem } from 'frog/ui'
import { SDAPI } from '@/app/lib'
import { Txt2imgInput } from '@/app/lib/type'
import {abi} from "../../lib/abi"

const app = new Frog({
  title:"frame",
  assetsPath: '/',
  basePath: '/api',

})



app.frame('/', (c) => {
  return c.res({
    action:'/prompt',
    image: `/background.png`,
    imageAspectRatio:'1:1',
    intents: [
      <Button value="">Let's Start</Button>
  ]  
  })
})


app.frame('/prompt', (c) => {
 
  return c.res({
    action:'/inspect',
    image:"/background3.jpeg",
    imageAspectRatio:'1.91:1',
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
    action:'/prompt',
    image: result?.outputs[0]?.url,
    imageAspectRatio:'1.91:1',
    intents: [
      <Button>Regenerate</Button>,
      <Button.Transaction target="/mint" >Mint</Button.Transaction>
    ]  
  })
})



// app.transaction('/mint', (c) => {
 
//   return c.contract({
//     abi,
//     functionName:'safeMint',
//     args: ["",""],
//     chainId: 'eip155:10',
//     to: '0xE6beF6641BF4b346B6dfa1e4E37f83FfeAe383e7',
//   })

// })


app.frame('/finish', (c) => {
  return c.res({
    action:'/prompt',
    image: `/background2.png`,
    imageAspectRatio:'1:1',
    intents: [<Button value="">Share</Button>]  
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

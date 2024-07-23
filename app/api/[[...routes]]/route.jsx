/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { createSystem } from 'frog/ui'
import { SDAPI } from '@/app/lib'
import { Txt2imgInput } from '@/app/lib/type'
import {abi} from "../../lib/abi"

const getRandomInt=(min, max) =>{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const app = new Frog({
  title:"frame",
  assetsPath: '/',
  basePath: '/api',
  initialState: {
    uri:""
  }
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
  const imageUrl = `https://frog-frame-coral.vercel.app/background3.jpeg`;
  return c.res({
    action:'/inspect',
    image: imageUrl,
    imageAspectRatio:'1.91:1',
    intents: [
      <TextInput placeholder="A cool cat on the beach..." />,
      <Button.Link >Generate</Button.Link>
      ]  
   })
})


app.frame('/inspect', async(c) => {
  const { inputText, deriveState } = c
  const api= new SDAPI()
  const result = await api.txt2img(inputText || "");
  const state = deriveState(previousState => {
     previousState.uri=result?.outputs[0]?.url
  })
 
  return c.res({
    action:'/finish',
    image: result?.outputs[0]?.url,
    imageAspectRatio:'1.91:1',
    intents: [
      <Button>Regenerate</Button>,
      <Button.Transaction target="/mint" >Mint</Button.Transaction>
    ]  
  })
})


app.transaction('/mint', (c) => {
  const {  previousState } = c

  const tokenId= getRandomInt(1, 1000);
  return c.contract({
    abi,
    functionName: 'safeMint',
    args: [tokenId,previousState?.uri],
    chainId: 'eip155:421614',
    to: '0xc707E384871fF5c253dECe60DbaDDd6812f2bE8e',
   })
  
})


app.frame('/finish', (c) => {
    
  return c.res({
    action:'/share',
    image: `/background2.png`,
    imageAspectRatio:'1:1',
    intents: [<Button value="">Share</Button>]  
  })
})

app.frame('/share', (c) => {
  const {  previousState } = c
  return c.res({
    image:previousState?.uri,
    imageAspectRatio:'1:1',
    intents: [
    <Button.Link href={`https://twitter.com/intent/tweet?url=${previousState?.uri}`}>x.com</Button.Link>,
    <Button.Link href={`https://warpcast.com/~/compose?embeds[]=${previousState?.uri}`}>Recast</Button.Link>,
    <Button value="">Discord</Button>
  ]  
  })
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

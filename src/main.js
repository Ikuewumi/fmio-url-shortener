import "./index.css"
import { z } from "zod"



// Typing a link
/**
 * @typedef {{short: string;url: string;}} LinkData
 */



const lsToken = 'fmioUrlShorteneriK'

// Element of the list
const listEl = document.querySelector('ul#result-list')


const sleep = (ms = 200) => {
   return (new Promise(res => setTimeout(res, ms)))
}

const removeEvents = async () => {
   const els = Array.from(listEl.querySelectorAll('.btn-copylink'))
   els.forEach(el => el.removeEventListener('click', _ => { }))
   return

}


/***
 * @param {HTMLElement} el
 */
const addEffects = (el) => {
   el.classList.add(...['bg-veryDarkBlue'])
   el.textContent = 'Copied!'
}


const removeEffects = (el) => {
   el.classList.remove(...['bg-veryDarkBlue'])
   el.textContent = 'Copy'
}

const copyText = async (str) => {
   const p = await navigator.permissions.query({ name: 'clipboard-write' })
   if (p.state === 'granted') { await (navigator.clipboard).writeText(str) }
   else { throw Error('cannot use the clipboard') }
}



const addEvents = async () => {

   const els = Array.from(listEl.querySelectorAll('.btn-copylink'))
   els.forEach(el => el.removeEventListener('click', _ => { }))
   await sleep(0)
   els.forEach(el => el.addEventListener('click', async () => {
      const shortLink = el.previousElementSibling.textContent.trim()
      await copyText(shortLink)
      addEffects(el)
      await sleep(4000)
      removeEffects(el)

   }))
   return

}




/**
 * @param {LinkData} link
 */
const addLink = (link) => {


   const html = `
      <li class="bg-white flex flex-col gap-0 md:divide-y-0 md:items-center rounded-lg divide-y divide-gray md:flex-row md:py-3 shadow-lg">
         <span class="font-normal md:font-normal md:grow px-4 py-3 md:py-0 span-link word-wrap">${link.url}</span>
         <div class="flex flex-col px-4 gap-2 py-3 md:flex-row  md:items-center md:py-0">
            <span class="text-cyan span-shortlink">${link.short}</span>
            <button class="btn-copylink py-3 md:grow-0 grow font-semibold md:font-semibold w-full md:px-5 md:py-2 md:w-auto bg-cyan text-white rounded-md">Copy</button>
         </div>
      </li>
   `




   listEl.innerHTML += html





}


// Setting up nav {}
const menuToggle = document.querySelector('#menu-toggle')
const header = document.querySelector('header')
menuToggle.addEventListener('click', () => { header.classList.toggle('on') })


const zLinkData = z.object({
   short: z.string(),
   url: z.string().url()
})
const zLinks = zLinkData.array().default([])
const getLsLinks = () => zLinks.parse(JSON.parse(localStorage.getItem(lsToken)) ?? [])


const object = { links: zLinks.parse([]) }
const globalLinks = new Proxy(object, {
   async set(obj, key, newVal) {
      if (key === 'links') {
         await removeEvents()
         const links = [...zLinks.parse(newVal), ...getLsLinks()]

         localStorage.setItem(lsToken, JSON.stringify(links))
         listEl.innerHTML = ``
         links.map(link => addLink(link))

         await addEvents()
         return Reflect.set(obj, 'links', links)
      }
   },

   get(obj, key) {
      if (key === 'links') { return [...getLsLinks()] }
   }
})


globalLinks.links = []


/*** @type {HTMLFormElement} */
const shortenForm = document.querySelector('form#shorten-form')
const shortenInput = shortenForm.querySelector('input')
shortenForm.addEventListener('submit', async (e) => {
   e.preventDefault()
   const a = await shortenLink(shortenInput.value.trim())
   globalLinks.links = [a]
})




















//Dummy data
const dummyData = {
   "ok": true,
   "result": {
      "code": "z1kkZd",
      "short_link": "shrtco.de/z1kkZd",
      "full_short_link": "https://shrtco.de/z1kkZd",
      "short_link2": "9qr.de/z1kkZd",
      "full_short_link2": "https://9qr.de/z1kkZd",
      "short_link3": "shiny.link/z1kkZd",
      "full_short_link3": "https://shiny.link/z1kkZd",
      "share_link": "shrtco.de/share/z1kkZd",
      "full_share_link": "https://shrtco.de/share/z1kkZd",
      "original_link": "https://tailwindcss.com/docs/scale"
   }
}



// setting up the async function for links
const shortenLink = async (link) => {
   const req = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`)
   const data = await req.json()
   // await sleep(20)
   // const data = dummyData
   if (!data.ok) { throw Error('invalid link') }

   const linkData = zLinkData.parse({
      short: data.result.full_short_link,
      url: data.result.original_link
   })


   return linkData
}




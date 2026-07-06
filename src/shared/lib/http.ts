import axios from 'axios'
import { env } from '@/shared/config/env'

// PokeAPI needs no key and has no meaningful rate limit for this app's usage
// pattern — unlike the OpenF1/Perenual projects in this portfolio, there's no
// throttled queue here, just a plain axios instance.
export const pokeApiHttp = axios.create({
  baseURL: env.pokeApiBaseUrl,
})

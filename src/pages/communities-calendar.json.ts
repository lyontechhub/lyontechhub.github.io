import type { APIRoute } from 'astro';
import { extractCalendars, getList } from '../lib/communities.ts';

export const GET: APIRoute = async () => {
  try {
    return new Response(JSON.stringify(getList().flatMap(extractCalendars)));
  } catch (error) {
    throw new Error('Something went wrong in communities-calendar.json route!');
  }
};

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
});

// Helper for generating image URLs
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  if (!source) return null;
  return builder.image(source);
}

// Reusable fetch utility with error handling
export async function sanityFetch(query, params = {}) {
  try {
    const data = await sanityClient.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null; // Return null gracefully on error
  }
}

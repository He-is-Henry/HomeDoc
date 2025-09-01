import fetch from "node-fetch";

export async function handler(event) {
  const { lat, lon } = event.queryStringParameters;

  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&apiKey=${
    import.meta.env.GEOAPIFY_KEY
  }`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

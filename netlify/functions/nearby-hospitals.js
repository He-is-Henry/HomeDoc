import fetch from "node-fetch";

export async function handler(event) {
  const { lat, lon } = event.queryStringParameters;

  // eslint-disable-next-line no-undef
  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&apiKey=${process.env.GEOAPIFY_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

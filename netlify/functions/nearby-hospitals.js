/* eslint-disable no-undef */
export async function handler(event) {
  const { lat, lon } = event.queryStringParameters;

  const apiKey = process.env.GEOAPIFY_KEY; // This should now be defined
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is missing" }),
    };
  }

  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&apiKey=${apiKey}`;
  console.log(url);

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

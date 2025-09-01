export async function handler(event) {
  const { lat, lon } = event.queryStringParameters;

  // eslint-disable-next-line no-undef
  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&apiKey=${
    import.meta.env.GEOAPIFY_KEY
  }`;
  console.log(url);

  const res = await fetch(url); // no import needed
  const data = await res.json();
  console.log(data);
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

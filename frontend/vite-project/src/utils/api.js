export const apiRequest = async (url, method, body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
};

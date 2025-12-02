// Test API connection
console.log('Testing API connection...');
console.log('API URL:', import.meta.env.VITE_API_URL);

fetch(import.meta.env.VITE_API_URL + '/health')
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('API Error:', error));
// --- INSTRUCTIONS FOR GOOGLE HIGHLVEL INTEGRATION ---
// The GoHighLevel API cannot be called directly from the browser due to security (CORS).
// You must create a backend function (a "serverless function") on your platform.

// STEP 1: In your app's hosting platform, find the section for "Serverless Functions" or "Backend Functions".
// STEP 2: Create a new function. Your platform will give you a URL for it.
// STEP 3: Paste the server-side code example below into that new function.
// STEP 4: Add your GoHighLevel API Key in your platform's "Environment Variables" or "Secrets" section.
// STEP 5: Update the `BACKEND_FUNCTION_URL` constant below with the URL from Step 2.

/*
// --- START: Code for your Backend/Serverless Function ---
// Copy and paste this entire block into the new function you create on your platform.

export default async function handler(req, res) {
  // Get the secret API key from your platform's environment variables.
  // In Google Cloud Functions, this is configured in the "Runtime variables, build and connections settings"
  const GOHIGHLEVEL_API_KEY = process.env.GOHIGHLEVEL_API_KEY;

  const API_URL = 'https://services.leadconnectorhq.com/contacts/';
  const API_VERSION = '2021-07-28';

  const { email } = req.body; // Get email from the request

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOHIGHLEVEL_API_KEY}`,
        'Version': API_VERSION
      },
      body: JSON.stringify({
        email: email,
        source: 'calorie.enzark.app'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GoHighLevel API Error:', errorData);
      return res.status(response.status).json({ message: 'Failed to add contact.', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json({ message: 'Contact added successfully!', data: data });

  } catch (error) {
    console.error('Error calling GoHighLevel:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
// --- END: Code for your Backend/Serverless Function ---
*/


/**
 * Adds a contact to GoHighLevel by calling our secure backend proxy function.
 * @param email The email of the contact to add.
 * @returns A promise that resolves to true on success, false on failure.
 */
export const addContactToGoHighLevel = async (email: string): Promise<boolean> => {
  // FINAL STEP: Paste the Trigger URL of your Google Cloud Function here.
  const BACKEND_FUNCTION_URL = 'PASTE_YOUR_CLOUD_FUNCTION_URL_HERE'; 

  if (BACKEND_FUNCTION_URL === 'PASTE_YOUR_CLOUD_FUNCTION_URL_HERE') {
    console.warn('GoHighLevel integration is not configured. Please update the BACKEND_FUNCTION_URL in services/goHighLevelService.ts');
    // To ensure a smooth user experience, we will simulate a successful call.
    // The contact will not actually be added until the URL is configured.
    return true; 
  }

  try {
    const response = await fetch(BACKEND_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      // The backend function itself returned an error.
      const errorData = await response.json();
      console.error('Backend function error:', errorData.message || 'Unknown error');
      return false;
    }

    console.log('Successfully sent contact information to backend.');
    return true;

  } catch (error) {
    // A network error occurred trying to reach the backend function.
    console.error('Failed to call the backend function:', error);
    return false;
  }
};
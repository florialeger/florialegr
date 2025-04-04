// This hook will handle fetching data from your API endpoints (/api/projects, /api/playgrounds) and also sending data (/api/messages).

import { useState, useEffect, useCallback } from 'react';

// Default options for fetch requests
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers if needed, e.g., Authorization
  },
};

/**
 * Custom hook for fetching data from an API endpoint.
 *
 * @param {string | null} url - The URL to fetch from. Pass null initially if you want to fetch manually later.
 * @param {object} options - Optional fetch options (method, headers, body, etc.). Merged with defaults.
 * @param {Array} dependencies - Optional dependency array to trigger refetch when values change.
 * @returns {{ data: any, loading: boolean, error: Error | null, refetch: function }}
 */
function useFetch(initialUrl = null, initialOptions = {}, dependencies = []) {
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState(initialOptions);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (fetchUrl = url, fetchOptions = options) => {
    if (!fetchUrl) {
      // Don't fetch if URL is null or empty
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const mergedOptions = {
        ...defaultOptions,
        ...fetchOptions,
        headers: {
          ...defaultOptions.headers,
          ...(fetchOptions.headers || {}),
        },
        signal, // Pass the abort signal to fetch
      };

      // Ensure body is stringified if it's an object (common for POST/PUT)
      if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
      }

      const response = await fetch(fetchUrl, mergedOptions);

      if (signal.aborted) return; // Don't process if aborted

      // Attempt to parse JSON, handle potential errors
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
         responseData = await response.json();
      } else {
         // Handle non-JSON responses if necessary, e.g., plain text
         responseData = await response.text();
      }

      if (!response.ok) {
        // Throw an error with the response data (often contains error details from API)
        const err = new Error(responseData.message || `HTTP error! status: ${response.status}`);
        err.response = response; // Attach response for more context
        err.data = responseData; // Attach parsed error data
        throw err;
      }

      setData(responseData);
      setError(null); // Clear previous errors on success

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error("Fetch error:", err);
        setError(err); // Set the error state
        setData(null); // Clear data on error
      }
    } finally {
      // Only set loading to false if the fetch wasn't aborted
      // This prevents state updates on unmounted components in some race conditions
      if (!signal.aborted) {
        setLoading(false);
      }
    }

    // Cleanup function for useEffect
    return () => {
      abortController.abort();
    };
  }, [url, JSON.stringify(options)]); // Stringify options for dependency check


  // Effect to fetch data automatically when URL, options, or dependencies change
  useEffect(() => {
    // Only fetch automatically if initialUrl was provided
    if(initialUrl) {
        const cleanup = fetchData();
        // Return the cleanup function directly if fetchData returns it
        // Note: fetchData's async nature means it won't directly return cleanup here.
        // The cleanup logic is handled by the AbortController within fetchData.
        // We need a separate cleanup for the effect itself.
        let aborted = false;
        const controller = new AbortController();
        const signal = controller.signal;

        const runFetch = async () => {
            await fetchData(url, options);
            // Add any specific effect cleanup if needed after fetch completes or errors
        };

        runFetch();

        // This effect cleanup will abort the controller used *within* fetchData
        return () => {
            controller.abort();
            aborted = true; // Flag to prevent state updates after unmount
        };
    }
  }, [initialUrl, url, JSON.stringify(options), fetchData, ...dependencies]); // Include dependencies

  // Manual refetch function
  const refetch = useCallback((newUrl = url, newOptions = options) => {
    setUrl(newUrl); // Update state if new URL/options are provided
    setOptions(newOptions);
    return fetchData(newUrl, newOptions); // Return the promise from fetchData
  }, [fetchData, url, options]);


  return { data, loading, error, refetch, setUrl, setOptions };
}

export default useFetch;

/*
// --- How to Use ---

// GET Request (e.g., fetch projects)
const { data: projects, loading, error } = useFetch('/api/projects');

if (loading) return <p>Loading projects...</p>;
if (error) return <p>Error loading projects: {error.message}</p>;

// POST Request (e.g., inside useForm's onSubmit)
const { data: response, loading: sending, error: sendError, refetch: sendMessage } = useFetch(null); // Start with null URL

const handleFormSubmit = async (formData) => {
  try {
    const result = await sendMessage('/api/messages', {
      method: 'POST',
      body: formData // useFetch stringifies objects automatically
    });
    // Handle successful submission (result will be the response data)
    console.log('Message sent:', result);
  } catch (err) {
     // Error is already set in the hook's state (sendError)
     console.error('Failed to send message:', sendError?.data || sendError?.message);
     // You can access err.data here for backend validation errors if needed
  }
};
*/
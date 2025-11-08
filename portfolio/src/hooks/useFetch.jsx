import { useState, useEffect, useCallback, useRef } from 'react';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const mergeOptions = (options = {}) => {
  const { headers, body, ...rest } = options;
  const nextOptions = {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...(headers || {}),
    },
  };

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    nextOptions.body = JSON.stringify(body);
  } else if (body) {
    nextOptions.body = body;
  }

  return nextOptions;
};

function useFetch(initialUrl = null, initialOptions = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialUrl));
  const [error, setError] = useState(null);
  const requestRef = useRef({ url: initialUrl, options: initialOptions });
  const abortRef = useRef(null);

  const executeFetch = useCallback(async (url, options = {}) => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return null;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...mergeOptions(options),
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const payload = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const err = new Error(payload?.message || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.data = payload;
        throw err;
      }

      setData(payload);
      return payload;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        setData(null);
      }
      throw err;
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const refetch = useCallback(
    async (url = requestRef.current.url, options = requestRef.current.options) => {
      requestRef.current = { url, options };
      try {
        return await executeFetch(url, options);
      } catch (err) {
        if (err.name === 'AbortError') {
          return null;
        }
        throw err;
      }
    },
    [executeFetch]
  );

  useEffect(() => {
    requestRef.current = { url: initialUrl, options: initialOptions };
    if (!initialUrl) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      try {
        await executeFetch(initialUrl, initialOptions);
      } catch (err) {
        if (err.name === 'AbortError' || cancelled) {
          return;
        }
        console.error('Fetch error:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [initialUrl, initialOptions, executeFetch]);

  return {
    data,
    loading,
    error,
    refetch,
    setRequest: (url, options = {}) => {
      requestRef.current = { url, options };
    },
  };
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

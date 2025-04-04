// Manages form state, input changes, validation (basic), and submission, designed to work with your contact form API.

import { useState, useCallback } from 'react';
import useFetch from './useFetch'; // Import useFetch for submission

/**
 * Custom hook for managing form state, validation, and submission.
 *
 * @param {object} initialValues - Initial values for form fields.
 * @param {function} onSubmit - Callback function executed on successful submission (receives form values).
 * @param {function} validate - Optional validation function (receives form values, returns errors object).
 * @returns {{
 *   values: object,
 *   errors: object,
 *   submitting: boolean,
 *   submitError: Error | null,
 *   handleChange: function,
 *   handleSubmit: function,
 *   resetForm: function
 * }}
 */
function useForm(initialValues = {}, onSubmit, validate = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const {
    data: submitResponse, // Response from the API call
    loading: submitting, // Loading state from useFetch
    error: submitError, // Error state from useFetch
    refetch: submitData, // The function to trigger the API call
    setUrl: setSubmitUrl, // Function to set the target URL
    setOptions: setSubmitOptions, // Function to set fetch options (method, body)
  } = useFetch(null); // Initialize useFetch without URL

  // Handle input changes (works for text, email, textarea, select)
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Validate the form based on the provided validate function
  const runValidation = useCallback(() => {
    if (!validate) {
      return true; // No validation function provided
    }
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Return true if no errors
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event) => {
      if (event) {
        event.preventDefault(); // Prevent default browser submission
      }

      // Run validation before submitting
      if (runValidation()) {
        try {
          // Configure useFetch for the submission
          setSubmitUrl('/api/messages'); // Your contact form endpoint
          setSubmitOptions({
            method: 'POST',
            body: values, // useFetch will stringify this object
          });

          // Trigger the fetch (submission)
          // The result/error will be available via submitResponse/submitError states
          const response = await submitData('/api/messages', {
            method: 'POST',
            body: values,
          });

          // Optionally call the user's onSubmit callback AFTER successful fetch
          // Check if submitError is null after the await
          // Note: Direct check after await might have race conditions.
          // It's safer to check the state *after* it updates or use the response
          if (response && !submitError) {
            // Check if response exists and no error occured during fetch
            if (onSubmit) {
              onSubmit(values, response); // Pass values and API response
            }
          } else {
            // Handle API-level errors caught by useFetch (already set in submitError state)
            // You might map backend validation errors (from submitError.data) to the form errors state here
            if (submitError?.data?.errors) {
              // Check if backend sent validation errors (like from express-validator)
              const backendErrors = submitError.data.errors.reduce(
                (acc, err) => {
                  acc[err.path || err.param] = err.msg; // Adapt based on your error structure
                  return acc;
                },
                {}
              );
              setErrors((prev) => ({ ...prev, ...backendErrors }));
            }
            console.error(
              'Submission failed:',
              submitError?.data || submitError?.message
            );
          }
        } catch (error) {
          // This catch block might catch errors from runValidation or onSubmit itself
          // Errors during the fetch itself are handled within useFetch and set to submitError
          console.error('Error during submission process:', error);
          // You could potentially set a generic error state here
          setErrors((prev) => ({
            ...prev,
            form: 'An unexpected error occurred.',
          }));
        }
      } else {
        console.log('Form validation failed');
        // Errors state is already updated by runValidation
      }
    },
    [
      values,
      runValidation,
      onSubmit,
      submitData,
      setSubmitUrl,
      setSubmitOptions,
      submitError,
    ]
  ); // Added submitError dependency

  // Function to reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    submitting, // From useFetch loading state
    submitError, // From useFetch error state
    submitResponse, // From useFetch data state
    handleChange,
    handleSubmit,
    resetForm,
    setErrors, // Expose setErrors if manual error setting is needed
  };
}

export default useForm;

/*
// --- How to Use ---

import React from 'react';
import useForm from './useForm';

// Example validation function
const validateContactForm = (values) => {
  const errors = {};
  if (!values.name) errors.name = 'Name is required';
  if (!values.from) {
    errors.from = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.from)) {
    errors.from = 'Invalid email address';
  }
  if (!values.message) errors.message = 'Message is required';
  // 'subject' is optional based on your backend model default
  return errors;
};


function ContactForm() {
  const handleSuccess = (submittedValues, apiResponse) => {
    console.log('Form Submitted Successfully!', submittedValues);
    console.log('API Response:', apiResponse); // { message: "Message sent successfully!" }
    alert('Message sent successfully!');
    resetForm(); // Clear the form
  };

  const {
    values,
    errors,
    submitting,
    submitError,
    submitResponse,
    handleChange,
    handleSubmit,
    resetForm
  } = useForm(
    { subject: '', name: '', from: '', message: '' }, // Initial values matching backend model/validation
    handleSuccess, // Function to call on successful API response
    validateContactForm // Your validation logic
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p id="name-error" style={{ color: 'red' }}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="from">Email:</label>
        <input
          type="email"
          id="from"
          name="from" // Should match the key in initialValues and backend
          value={values.from}
          onChange={handleChange}
          aria-invalid={!!errors.from}
          aria-describedby={errors.from ? "from-error" : undefined}
        />
        {errors.from && <p id="from-error" style={{ color: 'red' }}>{errors.from}</p>}
      </div>

       <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
           // No validation error shown as it's optional/has default
        />
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <p id="message-error" style={{ color: 'red' }}>{errors.message}</p>}
      </div>

      {submitError && (
         <p style={{ color: 'red' }}>
            Failed to send: {submitError.data?.message || submitError.message || 'Please try again.'}
         </p>
       )}
       // Optionally show success message based on submitResponse
       // {submitResponse && <p style={{ color: 'green' }}>{submitResponse.message}</p>} 

      <button type="submit" disabled={submitting}>
      {submitting ? 'Sending...' : 'Send Message'}
      </button>
      <button type="button" onClick={resetForm} disabled={submitting}>
        Reset
      </button>
    </form>
  );
}

*/

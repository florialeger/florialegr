
import React, { memo } from 'react';
import useForm from '@/hooks/useForm';
import Button from '@/components/ui/Button';
import styles from './ContactForm.module.css';

// Example validation function (adjust based on your useForm hook needs)
const validateContactForm = (values) => {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Name is required';
  if (!values.from?.trim()) {
    errors.from = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.from)) {
    errors.from = 'Invalid email address';
  }
  if (!values.message?.trim()) errors.message = 'Message is required';
  // Subject is optional with default in your backend
  return errors;
};

/**
 * The actual contact form, using the useForm hook for state and submission.
 */
const ContactForm = () => {
  const handleSuccess = (submittedValues, apiResponse) => {
    console.log('Form Submitted Successfully!', apiResponse);
    alert(apiResponse?.message || 'Message sent successfully!');
    resetForm(); // Clear the form
  };

  const {
    values,
    errors,
    submitting,
    submitError,
    // submitResponse, // Use if needed to show success message differently
    handleChange,
    handleSubmit,
    resetForm,
  } = useForm(
    { subject: '', name: '', from: '', message: '' }, // Initial values
    handleSuccess, // Callback on success
    validateContactForm // Validation function
  );

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
      {/* Optional general submission error */}
      {submitError && typeof submitError === 'string' && (
            <p className={`${styles.formError} ${styles.submitError}`}>
              {submitError}
            </p>
        )}
        {/* Optional backend validation summary */}
        {submitError?.data?.message && (
            <p className={`${styles.formError} ${styles.submitError}`}>
              {submitError.data.message}
            </p>
        )}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          aria-invalid={!!errors.name || !!submitError?.data?.errors?.find(e => e.path === 'name')}
          aria-describedby={errors.name || submitError?.data?.errors?.find(e => e.path === 'name') ? "name-error" : undefined}
          className={`${styles.input} ${errors.name || submitError?.data?.errors?.find(e => e.path === 'name') ? styles.inputError : ''}`}
        />
        {(errors.name || submitError?.data?.errors?.find(e => e.path === 'name')) && (
            <p id="name-error" className={styles.formError}>
             {errors.name || submitError?.data?.errors?.find(e => e.path === 'name')?.msg}
            </p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="from" className={styles.label}>Email</label>
        <input
          type="email"
          id="from"
          name="from"
          value={values.from}
          onChange={handleChange}
          required
           aria-invalid={!!errors.from || !!submitError?.data?.errors?.find(e => e.path === 'from')}
          aria-describedby={errors.from || submitError?.data?.errors?.find(e => e.path === 'from') ? "from-error" : undefined}
          className={`${styles.input} ${errors.from || submitError?.data?.errors?.find(e => e.path === 'from') ? styles.inputError : ''}`}
         />
         {(errors.from || submitError?.data?.errors?.find(e => e.path === 'from')) && (
            <p id="from-error" className={styles.formError}>
                {errors.from || submitError?.data?.errors?.find(e => e.path === 'from')?.msg}
            </p>
         )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>Subject <span className={styles.optional}>(Optional)</span></label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          className={styles.input}
        />
         {/* No error display needed as it's optional */}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={values.message}
          onChange={handleChange}
          required
          aria-invalid={!!errors.message || !!submitError?.data?.errors?.find(e => e.path === 'message')}
          aria-describedby={errors.message || submitError?.data?.errors?.find(e => e.path === 'message') ? "message-error" : undefined}
           className={`${styles.textarea} ${errors.message || submitError?.data?.errors?.find(e => e.path === 'message') ? styles.inputError : ''}`}
        />
        {(errors.message || submitError?.data?.errors?.find(e => e.path === 'message')) && (
            <p id="message-error" className={styles.formError}>
                {errors.message || submitError?.data?.errors?.find(e => e.path === 'message')?.msg}
            </p>
        )}
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default memo(ContactForm);

/* --- ContactForm.module.css (Example) ---
.contactForm {
    background-color: var(--form-bg, #f8f8f8);
    padding: 2rem;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--form-border-color, #eee);
}

.formGroup {
    margin-bottom: 1.5rem;
}

.label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-secondary-color);
}

.input,
.textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--input-border-color, #ccc);
    border-radius: var(--border-radius-small);
    font-size: 1rem;
    background-color: var(--input-bg, white);
    color: var(--text-color);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus,
.textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-focus-ring-color, rgba(0, 0, 255, 0.2));
}

.textarea {
    resize: vertical; 
    min-height: 120px;
}

 .inputError,
 .textarea.inputError {
     border-color: var(--error-color, red);
 }
  .inputError:focus,
 .textarea.inputError:focus {
    box-shadow: 0 0 0 2px var(--error-focus-ring-color, rgba(255, 0, 0, 0.2));
 }

.formError {
    color: var(--error-color, red);
    font-size: 0.85em;
    margin-top: 0.4rem;
}
.submitError {
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 500;
}

.optional {
    font-weight: 400;
    font-size: 0.9em;
    color: var(--text-tertiary-color, #999);
    margin-left: 0.3em;
}

.formActions {
    margin-top: 2rem;
    text-align: right;
}
*/

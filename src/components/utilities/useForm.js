import { useState } from 'react';

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Handles changes to form fields and updates the form state accordingly
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    resetError(name);
  };

  // Identifies errors according to the field value
  const handleBlur = (event) => {
    const { name, value, maxLength } = event.target
    if (!value) setErrors({ ...errors, [name]: `Campo em branco` })
    if (value.length < maxLength) setErrors({ ...errors, [name]: `São necessários ${maxLength} caracteres` })
  }

  // Handles changes to file input fields and updates the form state with the selected file and its URL
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];

    generateImageUrl(file, (url) => {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: { value: file, url },
      }));
    });
  };

  // Reads a file using the FileReader API and generates a URL for the file
  const generateImageUrl = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      callback(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Sets the value of a form field
  const setField = (fieldName, fieldValue) => {
    setForm((prevForm) => ({
      ...prevForm,
      [fieldName]: fieldValue,
    }));
  };

  // Sets an error message for a form field
  const setError = (fieldName, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  // Resets the error message for a form field
  const resetError = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: null,
    }));
  };

  // Resets the form state and error messages
  const resetForm = () => {
    setForm(initialState);
    setErrors({});
  };

  // Validates that all required fields have a value
  const isValid = () => {
    const errorFields = Object.keys(form).filter((fieldName) => {
      const fieldValue = form[fieldName];
      return !fieldValue || fieldValue.trim() === '';
    });
    if (errorFields.length > 0) {
      errorFields.forEach((fieldName) =>
        setError(fieldName, 'This field is required')
      );
      return false;
    }
    return true;
  };

  // Returns the current form state
  const getFormData = () => {
    return form;
  };

  // Validates the type of a form field value against a regular expression and sets an error message if the validation fails
  const validateFieldType = (fieldName, regex, errorMessage) => {
    const fieldValue = form[fieldName];
    if (fieldValue && !fieldValue.match(regex)) {
      setError(fieldName, errorMessage);
      return false;
    }
    return true;
  };


  return {
    form,
    setForm,
    errors,
    setErrors,
    handleChange,
    handleFileChange,
    generateImageUrl,
    setField,
    setError,
    resetError,
    resetForm,
    isValid,
    getFormData,
    validateFieldType,
    handleBlur
  };
};

export default useForm;

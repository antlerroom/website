/**
 * Antler Room - Main JavaScript
 * Handles smooth scrolling navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  // CSS scroll-behavior: smooth handles most cases,
  // but this provides fallback and better control

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if just "#" (logo link to top)
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetElement = document.querySelector(href);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /**
   * Mobile Menu Link Handling
   * Close mobile menu when clicking a navigation link
   */
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close the popover when a link is clicked
        mobileMenu.hidePopover();
      });
    });
  }

  /**
   * Form Validation
   * Uses HTML5 Constraint Validation API with custom error messages
   */

  const form = document.querySelector('.demo-form');

  if (form) {
    const inputs = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');

    // Real-time validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        // Clear error on input if previously invalid
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    // Submit validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Form is valid - show success state
        // Backend integration is v2 scope, so just show confirmation
        showFormSuccess();
      } else {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  }

  function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorSpan = formGroup ? formGroup.querySelector('.form-error') : null;

    // Skip validation for optional fields that are empty
    if (!field.hasAttribute('required') && field.value === '') {
      field.classList.remove('invalid', 'valid');
      if (errorSpan) errorSpan.textContent = '';
      return true;
    }

    // Reset custom validity
    field.setCustomValidity('');

    // Check native validity
    if (!field.checkValidity()) {
      field.classList.add('invalid');
      field.classList.remove('valid');

      if (errorSpan) {
        // Set custom error messages
        if (field.validity.valueMissing) {
          errorSpan.textContent = 'This field is required.';
        } else if (field.validity.typeMismatch) {
          if (field.type === 'email') {
            errorSpan.textContent = 'Please enter a valid email address.';
          } else if (field.type === 'url') {
            errorSpan.textContent = 'Please enter a valid URL (https://...).';
          }
        } else if (field.validity.patternMismatch) {
          errorSpan.textContent = field.dataset.errorMessage || 'Invalid format.';
        } else {
          errorSpan.textContent = 'Please check this field.';
        }
      }

      return false;
    } else {
      field.classList.remove('invalid');
      field.classList.add('valid');
      if (errorSpan) errorSpan.textContent = '';
      return true;
    }
  }

  function showFormSuccess() {
    // Replace form with success message
    const formContainer = form.parentElement;
    form.style.display = 'none';

    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <h3 class="form-success-title">TRANSMISSION RECEIVED</h3>
      <p class="form-success-text">Thank you for your submission. Our team will review your music and get back to you within 5-7 business days.</p>
      <p class="form-success-note">Please ensure your listen link remains active during this period.</p>
    `;
    formContainer.appendChild(successMessage);
  }
});

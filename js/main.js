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
});

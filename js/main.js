/**
 * Antler Room - Main JavaScript
 * Handles smooth scrolling navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Animated Background Grain
   * Full-page canvas grain that animates subtly
   */
  const bgCanvas = document.createElement('canvas');
  bgCanvas.className = 'bg-grain-canvas';
  document.body.insertBefore(bgCanvas, document.body.firstChild);

  const bgCtx = bgCanvas.getContext('2d');
  let grainFrame = 0;

  const resizeBgCanvas = () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  };
  resizeBgCanvas();
  window.addEventListener('resize', resizeBgCanvas);

  const renderBgGrain = () => {
    const width = bgCanvas.width;
    const height = bgCanvas.height;
    const imageData = bgCtx.createImageData(width, height);
    const data = imageData.data;

    // Animated grain with time-based seed
    grainFrame++;
    const seed = grainFrame * 0.1;

    for (let i = 0; i < data.length; i += 4) {
      // Pseudo-random based on position and time
      const noise = Math.random() * 255;
      const intensity = noise * 0.15; // Subtle grain

      data[i] = intensity;     // R
      data[i + 1] = intensity * 0.9; // G (slightly warm)
      data[i + 2] = intensity * 0.8; // B (warm tint)
      data[i + 3] = 30;        // Alpha - very subtle
    }

    bgCtx.putImageData(imageData, 0, 0);
  };

  // Animate at lower framerate for performance
  let lastGrainTime = 0;
  const grainInterval = 80; // ~12fps for grain animation

  const animateBgGrain = (timestamp) => {
    if (timestamp - lastGrainTime > grainInterval) {
      renderBgGrain();
      lastGrainTime = timestamp;
    }
    requestAnimationFrame(animateBgGrain);
  };

  // Check for reduced motion preference
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(animateBgGrain);
  } else {
    renderBgGrain(); // Just render once if reduced motion
  }

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
   * Nav Item Grain Cloud Effect
   * Small grain cloud that appears on hover over nav items
   */
  const navItems = document.querySelectorAll('.nav-links a, .logo');

  navItems.forEach(item => {
    // Create canvas for this nav item
    const navGrainCanvas = document.createElement('canvas');
    navGrainCanvas.className = 'nav-grain-cloud';
    navGrainCanvas.width = 80;
    navGrainCanvas.height = 60;
    item.style.position = 'relative';
    item.appendChild(navGrainCanvas);

    const navCtx = navGrainCanvas.getContext('2d');
    const particles = [];
    const particleCount = 25;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 25;
      particles.push({
        baseX: Math.cos(angle) * distance,
        baseY: Math.sin(angle) * distance,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.8 + 0.3
      });
    }

    let navTime = Math.random() * 100;
    let isHovering = false;
    let opacity = 0;
    let animationId = null;

    const animateNavGrain = () => {
      // Fade in/out
      if (isHovering && opacity < 1) {
        opacity += 0.08;
      } else if (!isHovering && opacity > 0) {
        opacity -= 0.05;
      }

      navGrainCanvas.style.opacity = opacity;

      if (opacity <= 0 && !isHovering) {
        animationId = null;
        return;
      }

      navCtx.clearRect(0, 0, navGrainCanvas.width, navGrainCanvas.height);
      navTime += 0.02;

      const centerX = navGrainCanvas.width / 2;
      const centerY = navGrainCanvas.height / 2;

      particles.forEach(p => {
        const driftX = Math.sin(navTime * p.driftSpeed + p.driftPhaseX) * 8;
        const driftY = Math.cos(navTime * p.driftSpeed + p.driftPhaseY) * 8;

        const x = centerX + p.baseX + driftX;
        const y = centerY + p.baseY + driftY;

        const flicker = Math.sin(navTime * 2 + p.driftPhaseX) * 0.15 + 0.85;
        const alpha = p.alpha * flicker;

        navCtx.fillStyle = `rgba(197, 160, 89, ${alpha})`;
        navCtx.fillRect(x, y, p.size, p.size);
      });

      animationId = requestAnimationFrame(animateNavGrain);
    };

    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      isHovering = true;
      if (!animationId) {
        animateNavGrain();
      }
    });

    item.addEventListener('mouseleave', () => {
      isHovering = false;
    });
  });

  /**
   * Genre "Other" Checkbox Toggle
   * Shows/hides the custom genre input field
   */
  const genreOtherCheckbox = document.getElementById('genre-other-checkbox');
  const genreOtherContainer = document.getElementById('genre-other-container');

  if (genreOtherCheckbox && genreOtherContainer) {
    genreOtherCheckbox.addEventListener('change', () => {
      genreOtherContainer.style.display = genreOtherCheckbox.checked ? 'block' : 'none';
      if (!genreOtherCheckbox.checked) {
        document.getElementById('genre-other').value = '';
      }
    });
  }

  /**
   * Form Validation
   * Uses HTML5 Constraint Validation API with custom error messages
   */

  const form = document.querySelector('.demo-form');

  if (form) {
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([name="website"]), select, textarea');

    // Anti-bot: Track form load time (bots submit too fast)
    const formLoadTime = Date.now();
    const minSubmitTime = 3000; // Minimum 3 seconds to fill form

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

    // Submit validation and Google Sheets integration
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Anti-bot check 1: Honeypot field (bots fill hidden fields)
      const honeypot = form.querySelector('#website');
      if (honeypot && honeypot.value !== '') {
        // Silently reject - show fake success to not alert bot
        showFormSuccess();
        return;
      }

      // Anti-bot check 2: Time-based (humans take time to fill forms)
      const timeSpent = Date.now() - formLoadTime;
      if (timeSpent < minSubmitTime) {
        // Too fast - likely a bot, show fake success
        showFormSuccess();
        return;
      }

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Collect form data
        const formData = {
          artistName: form.querySelector('#artist-name').value,
          email: form.querySelector('#email').value,
          releaseName: form.querySelector('#release-name').value,
          releaseType: form.querySelector('#release-type').value,
          listenLink: form.querySelector('#listen-link').value,
          genres: Array.from(form.querySelectorAll('input[name="genre"]:checked'))
            .map(cb => cb.value === 'other'
              ? form.querySelector('#genre-other').value
              : cb.nextElementSibling.nextSibling.textContent.trim())
            .filter(g => g)
            .join(', '),
          notes: form.querySelector('#notes').value || '',
          // Anti-bot: Include time spent (for server-side verification if needed)
          _timeSpent: Math.round(timeSpent / 1000)
        };

        // Show loading state
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SUBMITTING...';
        submitBtn.disabled = true;

        try {
          // Submit to Google Sheets using URL-encoded form data
          const urlParams = new URLSearchParams();
          Object.keys(formData).forEach(key => {
            urlParams.append(key, formData[key]);
          });

          await fetch('https://script.google.com/macros/s/AKfycbxmDetg6t8XmPSMe3ZfWnfJfApcC-QWVOJCUyZ8WR1NMaUeuQFaaFBVjX48MmEziB1D/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString()
          });

          // Show success (no-cors means we can't read response, but submission works)
          showFormSuccess();
        } catch (error) {
          console.error('Submission error:', error);
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert('There was an error submitting your demo. Please try again or email us directly.');
        }
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
    // Replace form with animated success message
    const formContainer = form.parentElement;
    form.style.display = 'none';

    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div class="form-success-grain-container">
        <canvas class="form-success-grain" width="300" height="200"></canvas>
      </div>
      <h3 class="form-success-title">DEMO RECEIVED</h3>
      <p class="form-success-text">Thank you for your submission. Our team will review your music and get back to you as soon as we can.</p>
      <p class="form-success-note">Please ensure your listen link remains active during this period.</p>
    `;
    formContainer.appendChild(successMessage);

    // Animate grain effect
    const grainCanvas = successMessage.querySelector('.form-success-grain');
    const grainCtx = grainCanvas.getContext('2d');
    const particles = [];
    const particleCount = 80;

    // Initialize particles in a burst pattern
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100;
      particles.push({
        x: grainCanvas.width / 2,
        y: grainCanvas.height / 2,
        targetX: grainCanvas.width / 2 + Math.cos(angle) * distance,
        targetY: grainCanvas.height / 2 + Math.sin(angle) * distance,
        size: Math.random() * 2 + 0.5,
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.2,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.8 + 0.3,
        delay: Math.random() * 30
      });
    }

    let frame = 0;
    let grainTime = 0;

    const animateSuccessGrain = () => {
      grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
      frame++;
      grainTime += 0.02;

      particles.forEach(p => {
        if (frame < p.delay) return;

        // Animate to target position
        const progress = Math.min((frame - p.delay) / 40, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        p.x += (p.targetX - p.x) * 0.08;
        p.y += (p.targetY - p.y) * 0.08;
        p.alpha += (p.targetAlpha - p.alpha) * 0.05;

        // Add drift after initial burst
        if (progress >= 1) {
          const driftX = Math.sin(grainTime * p.driftSpeed + p.driftPhaseX) * 8;
          const driftY = Math.cos(grainTime * p.driftSpeed + p.driftPhaseY) * 8;
          p.x = p.targetX + driftX;
          p.y = p.targetY + driftY;
        }

        const flicker = Math.sin(grainTime * 2 + p.driftPhaseX) * 0.15 + 0.85;
        const alpha = p.alpha * flicker;

        grainCtx.fillStyle = `rgba(197, 160, 89, ${alpha})`;
        grainCtx.fillRect(p.x, p.y, p.size, p.size);
      });

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(animateSuccessGrain);
      }
    };

    animateSuccessGrain();

    // Animate text fade-in
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      successMessage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    });
  }

  /**
   * Card Tilt Effect
   * Adds subtle 3D tilt to glass cards on mouse movement with smooth interpolation
   */
  const tiltCards = document.querySelectorAll('.strategy-pillar, .service-card, .team-card, .partner-card, .stat-item');

  tiltCards.forEach(card => {
    // Store current and target rotation for smooth interpolation
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentTranslateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetTranslateY = 0;
    let isHovering = false;
    let animationId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;
    const lerpFactor = 0.15; // Smoothing factor (lower = smoother but slower)

    const animateTilt = () => {
      currentRotateX = lerp(currentRotateX, targetRotateX, lerpFactor);
      currentRotateY = lerp(currentRotateY, targetRotateY, lerpFactor);
      currentTranslateY = lerp(currentTranslateY, targetTranslateY, lerpFactor);

      card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateY(${currentTranslateY}px)`;

      // Continue animation if not close enough to target
      const threshold = 0.01;
      if (Math.abs(currentRotateX - targetRotateX) > threshold ||
          Math.abs(currentRotateY - targetRotateY) > threshold ||
          Math.abs(currentTranslateY - targetTranslateY) > threshold) {
        animationId = requestAnimationFrame(animateTilt);
      } else {
        animationId = null;
      }
    };

    const startAnimation = () => {
      if (!animationId) {
        animationId = requestAnimationFrame(animateTilt);
      }
    };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Reduced rotation for subtler effect
      targetRotateX = (y - centerY) / 25;
      targetRotateY = (centerX - x) / 25;
      targetTranslateY = -3;
      isHovering = true;

      startAnimation();
    });

    card.addEventListener('mouseleave', () => {
      targetRotateX = 0;
      targetRotateY = 0;
      targetTranslateY = 0;
      isHovering = false;

      startAnimation();
    });
  });

  /**
   * Ambient Grain Effect for All Glass Cards
   * Adds subtle animated grain texture to cards for visual depth
   */
  const glassCards = document.querySelectorAll('.strategy-pillar, .service-card, .team-card, .partner-card, .stat-item');

  glassCards.forEach(card => {
    // Create canvas for ambient grain
    const grainCanvas = document.createElement('canvas');
    grainCanvas.className = 'card-ambient-grain';
    grainCanvas.width = 200;
    grainCanvas.height = 200;
    card.style.position = 'relative';
    card.appendChild(grainCanvas);

    const grainCtx = grainCanvas.getContext('2d');
    const particles = [];
    const particleCount = 40;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * grainCanvas.width,
        y: Math.random() * grainCanvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.5 + 0.2
      });
    }

    let cardTime = Math.random() * 100; // Random start offset for variety

    const animateCardGrain = () => {
      grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
      cardTime += 0.016;

      particles.forEach(p => {
        // Gentle sine-wave drift
        const driftX = Math.sin(cardTime * p.driftSpeed + p.driftPhaseX) * 15;
        const driftY = Math.cos(cardTime * p.driftSpeed + p.driftPhaseY) * 15;

        const x = p.x + driftX;
        const y = p.y + driftY;

        // Subtle alpha flicker
        const flicker = Math.sin(cardTime * 2 + p.driftPhaseX) * 0.1 + 0.9;
        const alpha = p.alpha * flicker;

        grainCtx.fillStyle = `rgba(197, 160, 89, ${alpha})`;
        grainCtx.fillRect(x, y, p.size, p.size);
      });

      requestAnimationFrame(animateCardGrain);
    };

    // Only animate if reduced motion is not preferred
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateCardGrain();
    }
  });

  /**
   * Mouse-Following Grain Cloud Effect
   * Canvas-based granular texture with inertia physics
   */
  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-grain-canvas';
  canvas.width = 200;
  canvas.height = 200;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Inertia physics state
  let mouseX = -300;
  let mouseY = -300;
  let cloudX = -300;
  let cloudY = -300;
  let velocityX = 0;
  let velocityY = 0;

  // Physics constants - instant following with minimal lag
  const springStrength = 0.8;   // How strongly cloud is pulled to mouse (higher = tighter)
  const damping = 0.6;          // Friction/drag (lower = less overshoot)
  const maxVelocity = 50;       // Cap velocity for stability

  // Generate grain particles with smooth sine-based movement
  const grainCount = 500;
  const grains = [];
  for (let i = 0; i < grainCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 75;
    grains.push({
      baseX: Math.cos(angle) * distance,
      baseY: Math.sin(angle) * distance,
      size: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.45 + 0.1,
      // Smooth oscillation parameters
      driftRadius: Math.random() * 20 + 8,
      driftSpeedX: Math.random() * 1.5 + 0.5,
      driftSpeedY: Math.random() * 1.5 + 0.5,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 2 + 1,
      flickerPhase: Math.random() * Math.PI * 2,
      // Individual particle inertia offset
      inertiaWeight: Math.random() * 0.3 + 0.7
    });
  }

  let time = 0;

  function animateGrainCloud() {
    // Apply spring physics - accelerate toward mouse position
    const dx = mouseX - cloudX;
    const dy = mouseY - cloudY;

    velocityX += dx * springStrength;
    velocityY += dy * springStrength;

    // Apply damping (friction)
    velocityX *= damping;
    velocityY *= damping;

    // Clamp velocity
    velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
    velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));

    // Update cloud position
    cloudX += velocityX;
    cloudY += velocityY;

    // Position canvas
    canvas.style.left = `${cloudX - canvas.width / 2}px`;
    canvas.style.top = `${cloudY - canvas.height / 2}px`;

    // Calculate velocity magnitude for particle effects
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const stretchFactor = Math.min(speed / 15, 1); // 0 to 1 based on movement speed

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.016;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    grains.forEach(grain => {
      // Smooth sine-wave based drift
      const driftX = Math.sin(time * grain.driftSpeedX + grain.phaseX) * grain.driftRadius;
      const driftY = Math.cos(time * grain.driftSpeedY + grain.phaseY) * grain.driftRadius;

      // Add velocity-based offset - particles trail behind based on their inertia weight (subtle)
      const inertiaOffsetX = -velocityX * (1 - grain.inertiaWeight) * 0.5;
      const inertiaOffsetY = -velocityY * (1 - grain.inertiaWeight) * 0.5;

      const x = centerX + grain.baseX + driftX + inertiaOffsetX;
      const y = centerY + grain.baseY + driftY + inertiaOffsetY;
      const dist = Math.sqrt(grain.baseX * grain.baseX + grain.baseY * grain.baseY);

      // Gentle flicker - slightly more when moving fast
      const flicker = Math.sin(time * grain.flickerSpeed + grain.flickerPhase) * (0.25 + stretchFactor * 0.1) + 0.75;
      const fadeAlpha = grain.baseAlpha * (1 - dist / 90) * flicker;

      if (fadeAlpha > 0) {
        ctx.fillStyle = `rgba(170, 140, 100, ${fadeAlpha})`;
        ctx.fillRect(x, y, grain.size, grain.size);
      }
    });

    requestAnimationFrame(animateGrainCloud);
  }

  animateGrainCloud();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach(card => {
      card.style.transform = 'none';
    });
    canvas.style.display = 'none';
  }

  /**
   * Stat Tile Grain Burst Effect
   * Creates a grain particle burst when hovering over expandable stat tiles
   */
  const expandableStats = document.querySelectorAll('.stat-item--expandable');

  expandableStats.forEach(stat => {
    const statNumber = stat.querySelector('.stat-number');
    if (!statNumber) return;

    // Create canvas for grain burst
    const burstCanvas = document.createElement('canvas');
    burstCanvas.className = 'stat-grain-burst';
    burstCanvas.width = 300;
    burstCanvas.height = 150;
    statNumber.appendChild(burstCanvas);

    const burstCtx = burstCanvas.getContext('2d');
    let particles = [];
    let burstAnimationId = null;
    let isAnimating = false;

    // Create burst particles
    const createBurst = (expanding) => {
      particles = [];
      const particleCount = 60;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const startRadius = expanding ? 0 : 80;

        particles.push({
          x: burstCanvas.width / 2,
          y: burstCanvas.height / 2,
          vx: Math.cos(angle) * speed * (expanding ? 1 : -0.5),
          vy: Math.sin(angle) * speed * (expanding ? 1 : -0.5),
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.3,
          decay: Math.random() * 0.02 + 0.015,
          life: 1
        });
      }
    };

    const animateBurst = () => {
      burstCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);

      let stillAlive = false;

      particles.forEach(p => {
        if (p.life <= 0) return;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= p.decay;

        if (p.life > 0) {
          stillAlive = true;
          const alpha = p.alpha * p.life;
          burstCtx.fillStyle = `rgba(197, 160, 89, ${alpha})`;
          burstCtx.fillRect(p.x, p.y, p.size, p.size);
        }
      });

      if (stillAlive) {
        burstAnimationId = requestAnimationFrame(animateBurst);
      } else {
        isAnimating = false;
        burstAnimationId = null;
      }
    };

    stat.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        createBurst(true);
        if (!isAnimating) {
          isAnimating = true;
          animateBurst();
        }
      }
    });

    stat.addEventListener('mouseleave', () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        createBurst(false);
        if (!isAnimating) {
          isAnimating = true;
          animateBurst();
        }
      }
    });
  });

  /**
   * Genre 3D Merry-Go-Round Carousel
   * Smooth continuous rotation with interaction support
   */
  const carousel = document.getElementById('genre-carousel');
  const prevBtn = document.querySelector('.genre-carousel-prev');
  const nextBtn = document.querySelector('.genre-carousel-next');

  if (carousel && prevBtn && nextBtn) {
    const items = carousel.querySelectorAll('.genre-carousel-item');
    const numItems = items.length;
    const angleStep = 360 / numItems;
    const radius = 280;

    // Continuous rotation state
    let currentRotation = 0;
    let targetRotation = 0;
    let isDragging = false;
    let isHovering = false;
    let dragStartX = 0;
    let dragStartRotation = 0;

    // Position each item at its fixed angle
    const initializePositions = () => {
      items.forEach((item, i) => {
        item.dataset.angle = angleStep * i;
      });
    };

    // Render carousel at given rotation angle
    const renderCarousel = (rotation) => {
      items.forEach((item) => {
        const baseAngle = parseFloat(item.dataset.angle);
        const displayAngle = (baseAngle + rotation) * (Math.PI / 180);

        const x = Math.sin(displayAngle) * radius;
        const z = Math.cos(displayAngle) * radius - radius;
        const scale = (z + radius * 2) / (radius * 2) * 0.4 + 0.6;
        const opacity = (z + radius * 2) / (radius * 2) * 0.6 + 0.4;

        item.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = Math.round((z + radius) * 10);
      });
    };

    // Animation loop for smooth continuous rotation
    const animate = () => {
      if (!isDragging && !isHovering) {
        // Slow continuous rotation
        currentRotation += 0.15;
        targetRotation = currentRotation;
      } else if (!isDragging && isHovering) {
        // Smooth lerp to target when hovering but not dragging
        currentRotation += (targetRotation - currentRotation) * 0.1;
      }

      renderCarousel(currentRotation);
      requestAnimationFrame(animate);
    };

    // Jump to next/prev item with smooth animation
    const jumpToNext = (direction) => {
      // Snap target to nearest item position, then move one step
      const snapped = Math.round(currentRotation / angleStep) * angleStep;
      targetRotation = snapped + (direction * angleStep);
      currentRotation = targetRotation; // Instant jump for button clicks
    };

    // Button controls - jump one tile
    prevBtn.addEventListener('click', () => jumpToNext(1));
    nextBtn.addEventListener('click', () => jumpToNext(-1));

    // Keyboard controls
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') jumpToNext(1);
      if (e.key === 'ArrowRight') jumpToNext(-1);
    });

    // Mouse drag - smooth continuous
    carousel.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartRotation = currentRotation;
      carousel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diff = e.clientX - dragStartX;
      currentRotation = dragStartRotation + diff * 0.3;
      targetRotation = currentRotation;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        carousel.style.cursor = 'grab';
        // Snap to nearest item
        targetRotation = Math.round(currentRotation / angleStep) * angleStep;
      }
    });

    // Touch support - smooth continuous
    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartRotation = currentRotation;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - dragStartX;
      currentRotation = dragStartRotation + diff * 0.3;
      targetRotation = currentRotation;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
      targetRotation = Math.round(currentRotation / angleStep) * angleStep;
    });

    // Pause auto-rotation on hover
    carousel.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    carousel.addEventListener('mouseleave', () => {
      isHovering = false;
    });

    // Initialize and start animation
    initializePositions();
    requestAnimationFrame(animate);
  }
});

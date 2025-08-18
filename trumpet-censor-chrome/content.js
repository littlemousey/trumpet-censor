// Zen Text Filter Content Script
(function() {
  'use strict';

  // Keywords to filter
  const keywords = [
    'Trump', 'Donald Trump', 'Russia', 'Putin', 
    'Israel', 'Netanyahu', 'Musk', 'Elon Musk', 'Republicans'
  ];

  // Zen meditation quotes
  const zenQuotes = [
    "Peace comes from within. Do not seek it without.",
    "The present moment is the only time over which we have dominion.",
    "Breathing in, I calm body and mind. Breathing out, I smile.",
    "Let go of what has passed. Let go of what may come.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "The mind is everything. What you think you become.",
    "Wherever you are, be there totally.",
    "Nothing is permanent in this wicked world, not even our troubles.",
    "The way is not in the sky. The way is in the heart.",
    "Quiet the mind, and the soul will speak.",
    "Be content with what you have; rejoice in the way things are.",
    "The root of suffering is resisting the certainty that no matter what the circumstances, uncertainty is all we truly have."
  ];

  // Create regex pattern for keywords (case insensitive)
  const keywordPattern = new RegExp(keywords.join('|'), 'gi');

  function getRandomZenQuote() {
    return zenQuotes[Math.floor(Math.random() * zenQuotes.length)];
  }

  function containsKeywords(text) {
    return keywordPattern.test(text);
  }

  function isHeadingElement(element) {
    const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    return headingTags.includes(element.tagName);
  }

  function isTitleElement(element) {
    // Check for common title selectors
    const titleSelectors = [
      '.title', '.headline', '.post-title', '.article-title',
      '.entry-title', '.story-title', '.news-title'
    ];
    
    return titleSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    ) || isHeadingElement(element);
  }

  function processTextNode(textNode) {
    if (!textNode.textContent.trim()) return;
    
    const parent = textNode.parentElement;
    if (!parent || parent.classList.contains('zen-processed')) return;

    if (containsKeywords(textNode.textContent)) {
      // Check if this is a title element
      if (isTitleElement(parent)) {
        // Replace title with zen quote
        const zenQuote = getRandomZenQuote();
        parent.textContent = zenQuote;
        parent.classList.add('zen-title-replacement', 'zen-processed');
      } else {
        // Blur regular text
        parent.classList.add('zen-blurred', 'zen-processed');
      }
    }
  }

  function processElement(element) {
    if (element.classList && element.classList.contains('zen-processed')) {
      return;
    }

    // Process text content
    if (element.childNodes) {
      for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          processElement(node);
        }
      }
    }
  }

  function initializeFilter() {
    // Process existing content
    processElement(document.body);

    // Set up observer for dynamic content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            processElement(node);
          } else if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilter);
  } else {
    initializeFilter();
  }

  // Also run after a short delay to catch any late-loading content
  setTimeout(initializeFilter, 1000);
})();
// Color-Coded Text Filter Content Script (Firefox Compatible)
(function() {
  'use strict';

  // Keywords categorized by person
  const keywordCategories = {
    trump: ['Trump', 'Donald Trump'],
    musk: ['Musk', 'Elon Musk'],
    putin: ['Putin', 'Russia'],
    netanyahu: ['Netanyahu', 'Israel'],
    other: ['Republicans']
  };

  // Silly jokes about people doing dumb things
  const sillyJokes = [
    "Someone tried to catch fog earlier. They mist.",
    "A person walked into a bar with jumper cables. The bartender said, 'I'll serve you, but don't start anything!'",
    "Someone invented a pencil with two erasers. It was pointless.",
    "A guy tried to sue the airline for losing his luggage. He lost his case.",
    "Someone bought a thesaurus, but when they got home all the pages were blank. They have no words to describe how angry they are.",
    "A person tried to write a book about procrastination but never got around to it.",
    "Someone thought they saw an eye doctor on an Alaskan island, but it turned out to be an optical Aleutian.",
    "A guy tried to make a belt out of watches but it was a waist of time.",
    "Someone tried to organize a hide and seek tournament, but good players are really hard to find.",
    "A person brought a ladder to the bar because they heard the drinks were on the house.",
    "Someone tried to catch some fog but mist their opportunity.",
    "A guy walked into a library and asked for books on paranoia. The librarian whispered, 'They're right behind you!'",
    "Someone tried to tell a joke about construction, but they're still working on it.",
    "A person bought shoes from a drug dealer. They don't know what they were laced with, but they've been tripping all day.",
    "Someone tried to write with a broken pencil but realized it was pointless."
  ];

  // Zen meditation quotes for titles
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

  function getRandomJoke() {
    return sillyJokes[Math.floor(Math.random() * sillyJokes.length)];
  }

  function getRandomZenQuote() {
    return zenQuotes[Math.floor(Math.random() * zenQuotes.length)];
  }

  function detectKeywordCategory(text) {
    const lowerText = text.toLowerCase();
    
    for (let category in keywordCategories) {
      for (let keyword of keywordCategories[category]) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
    return null;
  }

  function createTooltip(joke) {
    const tooltip = document.createElement('div');
    tooltip.className = 'zen-tooltip';
    tooltip.textContent = joke;
    return tooltip;
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
    
    return titleSelectors.some(selector => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch (e) {
        // Fallback for older Firefox versions that might not support matches()
        return element.querySelector && element.querySelector(selector);
      }
    }) || isHeadingElement(element);
  }

  function processTextNode(textNode) {
    if (!textNode.textContent.trim()) return;
    
    const parent = textNode.parentElement;
    if (!parent || parent.classList.contains('zen-processed')) return;

    const category = detectKeywordCategory(textNode.textContent);
    
    if (category) {
      // Check if this is a title element
      if (isTitleElement(parent)) {
        // Replace title with zen quote
        const zenQuote = getRandomZenQuote();
        parent.textContent = zenQuote;
        parent.classList.add('zen-title-replacement', 'zen-processed');
        parent.title = 'Original content filtered - zen quote displayed';
      } else {
        // Apply color coding based on category
        parent.classList.add('zen-' + category, 'zen-processed');
        
        // Create and add tooltip with joke
        const tooltip = createTooltip(getRandomJoke());
        parent.appendChild(tooltip);
        parent.style.position = 'relative';
      }
    }
  }

  function processElement(element) {
    if (element.classList && element.classList.contains('zen-processed')) {
      return;
    }

    // Process text content
    if (element.childNodes) {
      // Convert NodeList to array for Firefox compatibility
      const childNodes = Array.prototype.slice.call(element.childNodes);
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
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
    if (document.body) {
      processElement(document.body);
    }

    // Set up observer for dynamic content - with Firefox compatibility checks
    if (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) {
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // Convert NodeList to array for Firefox compatibility
          const addedNodes = Array.prototype.slice.call(mutation.addedNodes);
          addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              processElement(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              processTextNode(node);
            }
          });
        });
      });

      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    }
  }

  // Initialize when DOM is ready - Firefox compatible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilter);
  } else {
    initializeFilter();
  }

  // Also run after a short delay to catch any late-loading content
  setTimeout(function() {
    initializeFilter();
  }, 1000);

  // Additional initialization for Firefox
  if (typeof browser !== 'undefined' && browser.runtime) {
    // This is Firefox with WebExtensions API
    setTimeout(function() {
      initializeFilter();
    }, 2000);
  }
})();
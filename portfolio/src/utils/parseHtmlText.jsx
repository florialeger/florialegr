import React from 'react';

/**
 * Parse text with simple HTML tags into React elements
 * Supports: <strong>, <em>, <br>, <b>, <i>
 * @param {string} text - Text that may contain HTML tags
 * @param {number} keyPrefix - Optional key prefix for React rendering
 * @returns {React.ReactNode} - React elements
 */
const parseHtmlText = (text, keyPrefix = 0) => {
  if (!text || typeof text !== 'string') return text;

  // Check if there are any HTML tags
  if (!/<(?:strong|em|b|i|br\s*\/?)>/i.test(text)) {
    return text;
  }

  const parts = [];
  let lastIndex = 0;

  // Match opening and closing tags with content between them
  // Using [\s\S] to match any character including newlines
  const regex = /<(strong|em|b|i)>([\s\S]*?)<\/\1>|<br\s*\/?>/gi;

  let match;
  let matchIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the tag as plain string
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push(textBefore);
      }
    }

    const tagName = match[1];
    const content = match[2];

    // Handle <br> tags
    if (match[0].toLowerCase().startsWith('<br')) {
      parts.push(<br key={`br-${keyPrefix}-${matchIndex}`} />);
    }
    // Handle paired tags (strong, em, b, i)
    else if (tagName && content !== undefined) {
      if (tagName.toLowerCase() === 'b' || tagName.toLowerCase() === 'strong') {
        parts.push(<strong key={`strong-${keyPrefix}-${matchIndex}`}>{content}</strong>);
      } else if (tagName.toLowerCase() === 'em' || tagName.toLowerCase() === 'i') {
        parts.push(<em key={`em-${keyPrefix}-${matchIndex}`}>{content}</em>);
      }
    }

    lastIndex = match.index + match[0].length;
    matchIndex++;
  }

  // Add remaining text after last tag as plain string
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push(remainingText);
    }
  }

  // Return array if we found tags, otherwise return original text
  return parts.length > 0 ? parts : text;
};

export default parseHtmlText;

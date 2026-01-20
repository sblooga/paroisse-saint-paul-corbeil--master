import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags for rich content while blocking scripts
 * Includes iframe for embedded videos/podcasts from trusted sources
 */
export const sanitizeHtml = (html: string): string => {
  // Configure DOMPurify to allow iframes from trusted sources
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
      const element = node as Element;
      const src = element.getAttribute?.('src') || '';
      const trustedDomains = [
        'youtube.com',
        'youtube-nocookie.com',
        'youtu.be',
        'player.vimeo.com',
        'vimeo.com',
        'open.spotify.com',
        'embed.podcasts.apple.com',
        'w.soundcloud.com',
        'widget.deezer.com',
      ];
      
      const isTrusted = trustedDomains.some(domain => src.includes(domain));
      if (!isTrusted && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  });

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'ul', 'ol', 'li', 'strong', 'em', 'a', 'br', 
      'span', 'div', 'blockquote', 'img', 'iframe',
      'svg', 'path', 'polyline', 'line'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
      'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
      'scrolling', 'sandbox', 'data-align',
      // SVG attributes
      'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 
      'stroke-linecap', 'stroke-linejoin', 'd', 'points', 
      'x1', 'y1', 'x2', 'y2'
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
};

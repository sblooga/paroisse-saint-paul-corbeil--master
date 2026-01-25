import { Node, mergeAttributes } from '@tiptap/core';

/**
 * AudioBlock
 * A dedicated TipTap node to store and render an HTML5 audio player.
 * This avoids inserting raw HTML strings (which can be escaped by the editor).
 */
export const AudioBlock = Node.create({
  name: 'audioBlock',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
      type: { default: 'audio/mpeg' },
    };
  },

  parseHTML() {
    // Allow parsing previously saved HTML (wrapper div + audio)
    return [
      {
        tag: 'div[data-audio-block]',
        getAttrs: (el) => {
          const element = el as HTMLElement;
          const audio = element.querySelector('audio');
          const source = element.querySelector('audio > source');
          const title = element.getAttribute('data-title') || null;
          const src =
            element.getAttribute('data-src') ||
            source?.getAttribute('src') ||
            audio?.getAttribute('src') ||
            null;
          const type =
            element.getAttribute('data-type') ||
            source?.getAttribute('type') ||
            'audio/mpeg';

          return { src, title, type };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const title = HTMLAttributes.title as string | null;
    const src = HTMLAttributes.src as string | null;
    const type = (HTMLAttributes.type as string | null) || 'audio/mpeg';

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-audio-block': 'true',
        'data-src': src || undefined,
        'data-title': title || undefined,
        'data-type': type || undefined,
        class: 'my-4 p-4 bg-muted/50 rounded-lg',
      }),
      ['p', { class: 'font-medium mb-2' }, `🎧 ${title || ''}`.trim()],
      [
        'audio',
        { controls: 'true', class: 'w-full' },
        ['source', { src: src || undefined, type }],
        "Votre navigateur ne supporte pas l'audio.",
      ],
    ];
  },
});

# 📝 Rich Text Editor Complet - Implantation Clé en Main

Cette documentation complète contient tout le code nécessaire pour implémenter le Rich Text Editor (TipTap) dans un autre site React/Node.js.

---

## 📦 Dépendances NPM à Installer

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-youtube @tiptap/core dompurify @emoji-mart/react @emoji-mart/data lucide-react sonner react-i18next i18next clsx tailwind-merge class-variance-authority @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tabs @radix-ui/react-label @radix-ui/react-select @radix-ui/react-scroll-area
```

---

## 🏗️ Structure des Fichiers

```
src/
├── components/
│   ├── ui/
│   │   ├── rich-text-editor.tsx          # Composant principal
│   │   ├── emoji-picker.tsx              # Sélecteur d'emojis
│   │   ├── button.tsx                    # Composant Button (shadcn)
│   │   ├── dialog.tsx                    # Composant Dialog (shadcn)
│   │   ├── popover.tsx                   # Composant Popover (shadcn)
│   │   ├── tabs.tsx                      # Composant Tabs (shadcn)
│   │   ├── input.tsx                     # Composant Input (shadcn)
│   │   ├── label.tsx                     # Composant Label (shadcn)
│   │   ├── select.tsx                    # Composant Select (shadcn)
│   │   ├── scroll-area.tsx               # Composant ScrollArea (shadcn)
│   │   └── use-toast.ts                  # Hook Toast (shadcn)
│   ├── editor/
│   │   └── extensions/
│   │       └── AudioBlock.ts             # Extension personnalisée TipTap
│   └── icons/
│       └── (icônes Lucide)
├── lib/
│   ├── sanitize.ts                       # Sanitisation HTML (DOMPurify)
│   └── utils.ts                          # Utilitaires (cn, etc.)
└── i18n.ts                               # Configuration i18next (optionnel)
```

---

## 📄 Code des Fichiers Essentiels

### 1️⃣ **src/lib/sanitize.ts** - Sanitisation HTML

```typescript
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
      'svg', 'path', 'polyline', 'line',
      'audio', 'source'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
      'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
      'scrolling', 'sandbox', 'data-align', 'data-width',
      // SVG attributes
      'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 
      'stroke-linecap', 'stroke-linejoin', 'd', 'points', 
      'x1', 'y1', 'x2', 'y2',
      // Audio attributes
      'controls', 'preload', 'type'
    ],
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['iframe', 'audio', 'source'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'controls', 'preload', 'type'],
  });
};
```

---

### 2️⃣ **src/components/editor/extensions/AudioBlock.ts** - Extension Audio

```typescript
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
```

---

### 3️⃣ **src/components/ui/emoji-picker.tsx** - Sélecteur d'Emojis

```typescript
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Picker 
      data={data} 
      onEmojiSelect={onEmojiSelect}
      locale="fr"
      theme="light"
      previewPosition="none"
      skinTonePosition="none"
    />
  );
};

export default EmojiPicker;
```

---

### 4️⃣ **src/lib/utils.ts** - Utilitaires

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### 5️⃣ **src/components/ui/button.tsx** - Composant Button

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

---

### 6️⃣ **src/components/ui/dialog.tsx** - Composant Dialog

```typescript
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

---

### 7️⃣ **src/components/ui/popover.tsx** - Composant Popover

```typescript
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
```

---

### 8️⃣ **src/components/ui/tabs.tsx** - Composant Tabs

```typescript
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

---

## 🎯 Utilisation du Rich Text Editor

### Exemple d'Intégration Simple

```typescript
import { useState } from 'react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function MyPage() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>Mon Editeur</h1>
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Écrivez votre texte..."
        minHeight="400px"
      />
      <pre>{content}</pre>
    </div>
  );
}
```

### Props du Composant

```typescript
interface RichTextEditorProps {
  content: string;                    // Contenu HTML actuel
  onChange: (content: string) => void; // Callback pour les changements
  placeholder?: string;               // Placeholder (défaut: "Commencez à écrire...")
  className?: string;                 // Classes Tailwind personnalisées
  contentLanguage?: 'fr' | 'pl';      // Force la langue du correcteur
  minHeight?: string;                 // Hauteur minimale (défaut: "200px")
  simplified?: boolean;               // Barre d'outils simplifiée (défaut: false)
}
```

---

## 📋 Adapting the Editor to Your Project

### ⚠️ Adaptations Nécessaires

1. **Import/Export d'Audio**
   - Si vous n'avez pas de backend, commentez les appels `supabase.from('audio_files')`
   - Le boutton audio deviendra optionnel

2. **Langues**
   - Adaptez `SPELL_CHECK_LANGUAGES` selon vos besoins
   - Modifiez le code de langue par défaut (ligne ~266)

3. **Sauvegarde**
   - Le contenu est en HTML brut
   - Sanitisez avec `sanitizeHtml()` avant d'afficher côté public

4. **Stockage d'Images**
   - Les images sont uploadées automatiquement s'il y a Supabase
   - Sans Supabase, décommenter les sections d'upload custom

5. **Styling**
   - Tailwind CSS est obligatoire
   - Adaptez les classes si vous utilisez une autre approche CSS

---

## 🔗 Intégration Complète dans un Formulaire

```typescript
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // Sanitize before saving
    const sanitized = sanitizeHtml(content);
    
    // Send to your backend
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: sanitized,
      }),
    });

    if (response.ok) {
      alert('Article créé!');
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div>
        <label>Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label>Contenu</label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          minHeight="500px"
        />
      </div>

      <Button type="submit">Créer l'article</Button>
    </form>
  );
}
```

---

## 🛠️ Dépannage

### L'éditeur n'affiche pas le contenu ?
→ Vérifiez que vous utiliser `useEffect` pour synchroniser le contenu externe

### Les images ne s'uploadent pas ?
→ Vérifiez la présence de Supabase et que le bucket `media` existe

### Le correcteur orthographique ne fonctionne pas ?
→ Assurez-vous que `lang` et `spellcheck="true"` sont présents sur l'élément `.ProseMirror`

### L'audio ne s'affiche pas ?
→ Vérifiez que `AudioBlock.ts` est bien importé et que DOMPurify autorise les balises `<audio>`

---

## ✅ Checklist d'Intégration

- [ ] NPM packages installés
- [ ] Fichiers copiés dans `src/components/` et `src/lib/`
- [ ] Imports corrects dans votre composant
- [ ] Tailwind CSS configuré
- [ ] DOMPurify configuré pour la sanitisation
- [ ] Toast notification fonctionnelle (optionnel)
- [ ] i18next configuré si multilangue (optionnel)
- [ ] Supabase/backend intégré pour images (optionnel)

---

## 🎓 Notes Importantes

1. **Le HTML est généré par TipTap** → Sanitisez avec `sanitizeHtml()` avant d'afficher
2. **L'AudioBlock** est une extension personnalisée pour persister les lecteurs audio
3. **Le sélecteur d'émoji** dépend de `@emoji-mart/react`
4. **Les images** supportent l'alignement (left/center/right) et la largeur (25%-100%)
5. **Supabase est optionnel** mais rend les images/audio fonctionnelles

---

Bon développement ! 🚀

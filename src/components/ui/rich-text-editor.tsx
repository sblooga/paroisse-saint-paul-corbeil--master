import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useRef, forwardRef, useState, lazy, Suspense } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Button } from './button';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Smile,
  Video,
  FileAudio,
  FileText,
  Eye,
  Music,
  Play,
  Pause,
  Palette,
  X,
  Languages,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog';
import { Input } from './input';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { ScrollArea } from './scroll-area';
import { sanitizeHtml } from '@/lib/sanitize';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { AudioBlock } from '@/components/editor/extensions/AudioBlock';

// Lazy load emoji picker to avoid build issues
const EmojiPicker = lazy(() => import('./emoji-picker'));

interface AudioFile {
  id: string;
  title: string;
  title_fr: string | null;
  title_pl: string | null;
  file_url: string;
  active: boolean;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  /** Force the language used for editor UI behaviors (spellcheck lang, audio title selection). */
  contentLanguage?: 'fr' | 'pl';
  /** Minimum height for the editor content area */
  minHeight?: string;
  /** Simplified toolbar - only basic formatting (bold, italic, link, lists) */
  simplified?: boolean;
}

// Custom Image extension with alignment and size
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('data-width') || element.style.width || '100%',
        renderHTML: attributes => {
          const width = attributes.width || '100%';
          return {
            'data-width': width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height') || element.style.height,
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
          return {
            'data-align': attributes.align || 'center',
          };
        },
      },
    };
  },
});

// Generic iframe node (Spotify / Apple Podcasts / SoundCloud / Deezer embeds)
const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: '152' },
      frameborder: { default: '0' },
      allow: { default: null },
      allowfullscreen: { default: true },
      sandbox: { default: null },
      scrolling: { default: null },
      class: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes)];
  },
});

// Compress image before upload
const compressImage = async (file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    img.onload = () => {
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => resolve(blob!), 'image/webp', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Extract YouTube video ID
const getYoutubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Extract Vimeo video ID
const getVimeoVideoId = (url: string): string | null => {
  const regex = /(?:vimeo\.com\/)(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  className,
  contentLanguage,
  minHeight = '200px',
  simplified = false,
}, ref) => {
  const { i18n } = useTranslation();

  // Supported languages for spell checker
  const SPELL_CHECK_LANGUAGES = [
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'pl', label: '🇵🇱 Polski' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'pt', label: '🇵🇹 Português' },
    { code: 'de', label: '🇩🇪 Deutsch' },
    { code: 'it', label: '🇮🇹 Italiano' },
    { code: 'nl', label: '🇳🇱 Nederlands' },
    { code: 'uk', label: '🇺🇦 Українська' },
    { code: 'ru', label: '🇷🇺 Русский' },
  ];

  // In the CMS we edit FR and PL content side-by-side.
  // The inserted audio title must follow the *content language being edited*,
  // not necessarily the global UI language.
  const defaultLang: string =
    contentLanguage ?? (i18n.language?.startsWith('pl') ? 'pl' : 'fr');
  
  // Local state for spell check language (can be changed by user)
  const [spellCheckLang, setSpellCheckLang] = useState<string>(defaultLang);
  
  const isFrench = spellCheckLang === 'fr';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showPodcastDialog, setShowPodcastDialog] = useState(false);
  const [showDriveDialog, setShowDriveDialog] = useState(false);
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [podcastUrl, setPodcastUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlign, setImageAlign] = useState('center');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  // Audio library state
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio files when podcast dialog opens
  useEffect(() => {
    if (showPodcastDialog) {
      fetchAudioFiles();
    }
  }, [showPodcastDialog]);

  const fetchAudioFiles = async () => {
    setLoadingAudio(true);
    const { data, error } = await supabase
      .from('audio_files')
      .select('id, title, title_fr, title_pl, file_url, active')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setAudioFiles(data);
    }
    setLoadingAudio(false);
  };

  const toggleAudioPreview = (file: AudioFile) => {
    if (playingAudioId === file.id) {
      audioPreviewRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      audioPreviewRef.current = new Audio(file.file_url);
      audioPreviewRef.current.play();
      audioPreviewRef.current.onended = () => setPlayingAudioId(null);
      setPlayingAudioId(file.id);
    }
  };

  const insertAudioFromLibrary = (file: AudioFile) => {
    if (!editor) return;
    const title = isFrench ? (file.title_fr || file.title) : (file.title_pl || file.title);
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'audioBlock',
        attrs: {
          src: file.file_url,
          title,
          type: 'audio/mpeg',
        },
      })
      .run();
    
    // Stop preview if playing
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setPlayingAudioId(null);
    }
    
    setShowPodcastDialog(false);
    toast.success('Audio inséré');
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-playfair',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 space-y-1 font-lato',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 space-y-1 font-lato',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic my-4 font-lato',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2 font-lato',
          },
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: false,
      }),
      Iframe,
      AudioBlock,
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'mx-auto my-4 rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_p]:mb-2 [&_h1]:font-playfair [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:font-playfair [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-playfair [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_p]:font-lato [&_li]:font-lato',
        spellcheck: 'true',
        lang: spellCheckLang,
        style: `min-height: ${minHeight};`,
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update spell check language when user changes it
  useEffect(() => {
    if (!editor) return;

    // IMPORTANT: use the current editor instance DOM.
    // Using document.querySelector('.ProseMirror') breaks when multiple editors exist on the page
    // (e.g. FR + PL tabs) because it only updates the first one.
    const editorElement = editor.view.dom as HTMLElement;
    editorElement.setAttribute('lang', spellCheckLang);
    editorElement.setAttribute('spellcheck', 'true');
  }, [spellCheckLang, editor]);

  // Step 1: User picks a file -> show settings dialog BEFORE upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Seules les images sont acceptées');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 5Mo)');
      return;
    }

    // Store file and show settings dialog
    setPendingImageFile(file);
    setImageWidth('100%');
    setImageAlign('center');
    setShowImageSettings(true);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 2: User confirms settings -> upload and insert with chosen settings
  const confirmImageUpload = async () => {
    if (!pendingImageFile || !editor) return;

    try {
      toast.loading('Téléchargement de l\'image...');
      
      // Compress image (skip for GIFs)
      let fileToUpload: Blob | File = pendingImageFile;
      if (!pendingImageFile.type.includes('gif')) {
        fileToUpload = await compressImage(pendingImageFile);
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, fileToUpload, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Insert image WITH the chosen settings directly
      editor.chain().focus().setImage({
        src: urlData.publicUrl,
        alt: pendingImageFile.name,
        width: imageWidth,
        align: imageAlign,
      } as any).run();

      toast.dismiss();
      toast.success('Image ajoutée');
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors du téléchargement');
      console.error(error);
    }

    // Cleanup
    setPendingImageFile(null);
    setShowImageSettings(false);
  };

  const cancelImageUpload = () => {
    setPendingImageFile(null);
    setShowImageSettings(false);
  };

  const insertVideo = () => {
    if (!editor || !videoUrl) return;
    
    // Check for YouTube
    const youtubeId = getYoutubeVideoId(videoUrl);
    if (youtubeId) {
      editor.commands.setYoutubeVideo({
        src: videoUrl,
        width: 640,
        height: 360,
      });
      setVideoUrl('');
      setShowVideoDialog(false);
      toast.success('Vidéo YouTube ajoutée');
      return;
    }
    
    // Check for Vimeo
    const vimeoId = getVimeoVideoId(videoUrl);
    if (vimeoId) {
      const embedHtml = `<div class="my-4 flex justify-center"><iframe src="https://player.vimeo.com/video/${vimeoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="rounded-lg"></iframe></div>`;
      editor.chain().focus().insertContent(embedHtml).run();
      setVideoUrl('');
      setShowVideoDialog(false);
      toast.success('Vidéo Vimeo ajoutée');
      return;
    }
    
    toast.error('URL de vidéo non reconnue (YouTube ou Vimeo)');
  };

  const insertPodcast = () => {
    if (!editor || !podcastUrl) return;

    // Spotify
    if (podcastUrl.includes('spotify.com')) {
      const spotifyMatch = podcastUrl.match(/(?:episode|show|track)\/([a-zA-Z0-9]+)/);
      if (spotifyMatch) {
        const type = podcastUrl.includes('/episode/') ? 'episode' : podcastUrl.includes('/show/') ? 'show' : 'track';
        editor.chain().focus().insertContent({
          type: 'iframe',
          attrs: {
            src: `https://open.spotify.com/embed/${type}/${spotifyMatch[1]}`,
            width: '100%',
            height: '152',
            frameborder: '0',
            allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
            class: 'rounded-lg',
          },
        }).run();
        setPodcastUrl('');
        setShowPodcastDialog(false);
        toast.success('Podcast ajouté');
        return;
      }
    }

    // Apple Podcasts
    if (podcastUrl.includes('podcasts.apple.com')) {
      editor.chain().focus().insertContent({
        type: 'iframe',
        attrs: {
          src: podcastUrl.replace('podcasts.apple.com', 'embed.podcasts.apple.com'),
          height: '175',
          frameborder: '0',
          sandbox: 'allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation',
          allow: 'autoplay *; encrypted-media *; clipboard-write',
          class: 'w-full rounded-lg',
        },
      }).run();
      setPodcastUrl('');
      setShowPodcastDialog(false);
      toast.success('Podcast ajouté');
      return;
    }

    // SoundCloud
    if (podcastUrl.includes('soundcloud.com')) {
      editor.chain().focus().insertContent({
        type: 'iframe',
        attrs: {
          src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(podcastUrl)}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`,
          width: '100%',
          height: '166',
          scrolling: 'no',
          frameborder: 'no',
          class: 'rounded-lg',
        },
      }).run();
      setPodcastUrl('');
      setShowPodcastDialog(false);
      toast.success('Podcast ajouté');
      return;
    }

    // Deezer
    if (podcastUrl.includes('deezer.com')) {
      const deezerMatch = podcastUrl.match(/(?:episode|podcast)\/(\d+)/);
      if (deezerMatch) {
        const type = podcastUrl.includes('/episode/') ? 'episode' : 'podcast';
        editor.chain().focus().insertContent({
          type: 'iframe',
          attrs: {
            src: `https://widget.deezer.com/widget/dark/${type}/${deezerMatch[1]}`,
            width: '100%',
            height: '152',
            frameborder: '0',
            allow: 'encrypted-media; clipboard-write',
            class: 'rounded-lg',
          },
        }).run();
        setPodcastUrl('');
        setShowPodcastDialog(false);
        toast.success('Podcast ajouté');
        return;
      }
    }

    toast.error('URL de podcast non reconnue (Spotify, Apple Podcasts, SoundCloud, Deezer)');
  };

  const insertGoogleDrive = () => {
    if (!editor || !driveUrl) return;
    
    // Extract Google Drive file ID
    const driveMatch = driveUrl.match(/[-\w]{25,}/);
    if (driveMatch) {
      const fileId = driveMatch[0];
      const embedHtml = `<div class="my-4 p-4 border rounded-lg bg-muted/50"><a href="https://drive.google.com/file/d/${fileId}/view" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-primary hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>Document Google Drive</a></div>`;
      editor.chain().focus().insertContent(embedHtml).run();
      setDriveUrl('');
      setShowDriveDialog(false);
      toast.success('Lien Google Drive ajouté');
    } else {
      toast.error('URL Google Drive non valide');
    }
  };

  const insertEmoji = (emoji: any) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji.native).run();
  };

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL du lien:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn('border rounded-md bg-background', className)}>
      {/* Toolbar - Simplified or Full */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        {/* Basic formatting - always visible */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
          title="Gras"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
          title="Italique"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        {/* Strikethrough - only in full mode */}
        {!simplified && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-accent' : ''}
            title="Barré"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        )}
        
        {/* Text Color Picker - only in full mode */}
        {!simplified && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                title="Couleur du texte"
                className="relative"
              >
                <Palette className="h-4 w-4" />
                {editor.getAttributes('textStyle').color && (
                  <span 
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full"
                    style={{ backgroundColor: editor.getAttributes('textStyle').color }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Couleur du texte</span>
                  {editor.getAttributes('textStyle').color && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().unsetColor().run()}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {[
                    '#000000', '#374151', '#6B7280', '#9CA3AF',
                    '#DC2626', '#EA580C', '#D97706', '#CA8A04',
                    '#16A34A', '#059669', '#0D9488', '#0891B2',
                    '#2563EB', '#4F46E5', '#7C3AED', '#A855F7',
                    '#C026D3', '#DB2777', '#E11D48', '#F43F5E',
                    '#1034A6', '#00C268', '#F4A325', '#8B4513',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => editor.chain().focus().setColor(color).run()}
                      className={cn(
                        'w-6 h-6 rounded border border-border hover:scale-110 transition-transform',
                        editor.getAttributes('textStyle').color === color && 'ring-2 ring-primary ring-offset-1'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Label htmlFor="custom-color" className="text-xs">Personnalisée:</Label>
                  <input
                    id="custom-color"
                    type="color"
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {!simplified && <div className="w-px h-6 bg-border mx-1" />}
        
        {/* Headings - only in full mode */}
        {!simplified && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
              title="Titre 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
              title="Titre 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
              title="Titre 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {!simplified && <div className="w-px h-6 bg-border mx-1" />}
        
        {/* Text alignment - only in full mode */}
        {!simplified && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
              title="Aligner à gauche"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
              title="Centrer"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
              title="Aligner à droite"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
              title="Justifier"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Lists - always visible */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
          title="Liste à puces"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
          title="Liste numérotée"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        {/* Blockquote - only in full mode */}
        {!simplified && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-accent' : ''}
            title="Citation"
          >
            <Quote className="h-4 w-4" />
          </Button>
        )}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Link - always visible */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-accent' : ''}
          title="Lien"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        {/* Emoji picker - only in full mode */}
        {!simplified && (
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" title="Émojis">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Suspense fallback={<div className="p-4">Chargement...</div>}>
                <EmojiPicker onEmojiSelect={insertEmoji} />
              </Suspense>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Media buttons - only in full mode */}
        {!simplified && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* Image upload */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Video */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowVideoDialog(true)}
              title="Vidéo (YouTube, Vimeo)"
            >
              <Video className="h-4 w-4" />
            </Button>
            
            {/* Podcast */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPodcastDialog(true)}
              title="Podcast (Spotify, Apple, SoundCloud)"
            >
              <FileAudio className="h-4 w-4" />
            </Button>
            
            {/* Google Drive */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDriveDialog(true)}
              title="Fichier Google Drive"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Undo/Redo - always visible */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annuler"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rétablir"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Language selector for spell check */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Langue du correcteur orthographique"
              className="gap-1 px-2"
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs uppercase font-medium">{spellCheckLang}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground mb-2 px-2">Langue du correcteur</p>
              {SPELL_CHECK_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSpellCheckLang(lang.code)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
                    spellCheckLang === lang.code 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {!simplified && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            
            <Button
              type="button"
              variant={showPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title="Prévisualiser"
              className={showPreview ? "bg-primary text-primary-foreground" : ""}
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">Aperçu</span>
            </Button>
          </>
        )}
      </div>
      
      {/* Editor or Preview */}
      {showPreview ? (
        <div className="min-h-[200px] p-4 bg-background">
          <div className="prose prose-lg max-w-none text-foreground overflow-hidden
            [&_h1]:font-playfair [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:mt-4
            [&_h2]:font-playfair [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-6
            [&_h3]:font-playfair [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-3
            [&_p]:font-lato [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground/90
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:font-lato
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:font-lato
            [&_li]:text-foreground/90
            [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-4 [&_img]:shadow-md
            [&_img[data-align='left']]:float-left [&_img[data-align='left']]:mr-4 [&_img[data-align='left']]:mb-2 [&_img[data-align='left']]:clear-left
            [&_img[data-align='right']]:float-right [&_img[data-align='right']]:ml-4 [&_img[data-align='right']]:mb-2 [&_img[data-align='right']]:clear-right
            [&_img[data-align='center']]:mx-auto [&_img[data-align='center']]:block [&_img[data-align='center']]:clear-both
            [&_img[data-width='25%']]:w-1/4 [&_img[data-width='33%']]:w-1/3 [&_img[data-width='50%']]:w-1/2 
            [&_img[data-width='66%']]:w-2/3 [&_img[data-width='75%']]:w-3/4 [&_img[data-width='100%']]:w-full
            [&_iframe]:rounded-lg [&_iframe]:my-4 [&_iframe]:w-full [&_iframe]:max-w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(editor?.getHTML() || '') }}
          />
        </div>
      ) : (
        <EditorContent
          editor={editor}
          // Some browsers rely on the closest ancestor lang/spellcheck for contenteditable.
          // Setting it here in addition to editorProps avoids inconsistent behavior across pages.
          lang={spellCheckLang}
          spellCheck
        />
      )}
      
      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">URL de la vidéo (YouTube ou Vimeo)</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
              Annuler
            </Button>
            <Button onClick={insertVideo}>Insérer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Podcast Dialog */}
      <Dialog open={showPodcastDialog} onOpenChange={(open) => {
        setShowPodcastDialog(open);
        if (!open && audioPreviewRef.current) {
          audioPreviewRef.current.pause();
          setPlayingAudioId(null);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un audio / podcast</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">
                <Music className="h-4 w-4 mr-2" />
                Bibliothèque
              </TabsTrigger>
              <TabsTrigger value="external">
                <FileAudio className="h-4 w-4 mr-2" />
                Lien externe
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="mt-4">
              {loadingAudio ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin text-2xl">⏳</div>
                </div>
              ) : audioFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Aucun audio dans la bibliothèque</p>
                  <p className="text-sm">Ajoutez des fichiers dans Admin → Podcasts/Homélies</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {audioFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        style={{ maxWidth: '100%' }}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAudioPreview(file)}
                          className="shrink-0 h-8 w-8 p-0"
                        >
                          {playingAudioId === file.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <span 
                          className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ flex: '1 1 0%', minWidth: 0 }}
                          title={isFrench ? (file.title_fr || file.title) : (file.title_pl || file.title)}
                        >
                          {isFrench ? (file.title_fr || file.title) : (file.title_pl || file.title)}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => insertAudioFromLibrary(file)}
                          className="shrink-0 whitespace-nowrap"
                        >
                          Insérer
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            
            <TabsContent value="external" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="podcast-url">URL du podcast</Label>
                  <Input
                    id="podcast-url"
                    value={podcastUrl}
                    onChange={(e) => setPodcastUrl(e.target.value)}
                    placeholder="https://open.spotify.com/episode/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supporte: Spotify, Apple Podcasts, SoundCloud, Deezer
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPodcastDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={insertPodcast} disabled={!podcastUrl}>
                    Insérer
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Google Drive Dialog */}
      <Dialog open={showDriveDialog} onOpenChange={setShowDriveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un fichier Google Drive</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="drive-url">URL du fichier Google Drive</Label>
              <Input
                id="drive-url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Copiez le lien de partage du fichier
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDriveDialog(false)}>
              Annuler
            </Button>
            <Button onClick={insertGoogleDrive}>Insérer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Settings Dialog */}
      <Dialog open={showImageSettings} onOpenChange={setShowImageSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres de l'image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-width">Largeur</Label>
              <Select value={imageWidth} onValueChange={setImageWidth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25%">25%</SelectItem>
                  <SelectItem value="33%">33%</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                  <SelectItem value="66%">66%</SelectItem>
                  <SelectItem value="75%">75%</SelectItem>
                  <SelectItem value="100%">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image-align">Alignement</Label>
              <Select value={imageAlign} onValueChange={setImageAlign}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Gauche (texte autour)</SelectItem>
                  <SelectItem value="center">Centre</SelectItem>
                  <SelectItem value="right">Droite (texte autour)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelImageUpload}>
              Annuler
            </Button>
            <Button onClick={confirmImageUpload}>Insérer l'image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

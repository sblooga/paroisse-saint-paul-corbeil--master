import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useRef, forwardRef, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// Custom Image extension with alignment and size
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width') || element.style.width,
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width, style: `width: ${attributes.width}` };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height') || element.style.height,
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height, style: `height: ${attributes.height}` };
        },
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
          const alignClasses: Record<string, string> = {
            left: 'float-left mr-4 mb-2',
            right: 'float-right ml-4 mb-2',
            center: 'mx-auto block',
          };
          return {
            'data-align': attributes.align,
            class: `max-w-full h-auto rounded-md my-4 ${alignClasses[attributes.align] || alignClasses.center}`,
          };
        },
      },
    };
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
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showPodcastDialog, setShowPodcastDialog] = useState(false);
  const [showDriveDialog, setShowDriveDialog] = useState(false);
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [podcastUrl, setPodcastUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlign, setImageAlign] = useState('center');

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
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_p]:mb-2 [&_h1]:font-playfair [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:font-playfair [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-playfair [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_p]:font-lato [&_li]:font-lato',
        spellcheck: 'true',
        lang: 'fr',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      toast.loading('Téléchargement de l\'image...');
      
      // Compress image (skip for GIFs)
      let fileToUpload: Blob | File = file;
      if (!file.type.includes('gif')) {
        fileToUpload = await compressImage(file);
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

      editor.chain().focus().setImage({ 
        src: urlData.publicUrl,
        alt: file.name,
      }).run();
      
      setShowImageSettings(true);
      toast.dismiss();
      toast.success('Image ajoutée - Configurez la taille et l\'alignement');
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors du téléchargement');
      console.error(error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyImageSettings = () => {
    if (!editor) return;
    
    const { state } = editor;
    const { from, to } = state.selection;
    
    // Find image node in selection
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === 'image') {
        editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
          width: imageWidth,
          align: imageAlign,
        }).run();
      }
    });
    
    setShowImageSettings(false);
    toast.success('Image mise à jour');
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
    
    let embedHtml = '';
    
    // Spotify
    if (podcastUrl.includes('spotify.com')) {
      const spotifyMatch = podcastUrl.match(/(?:episode|show|track)\/([a-zA-Z0-9]+)/);
      if (spotifyMatch) {
        const type = podcastUrl.includes('/episode/') ? 'episode' : podcastUrl.includes('/show/') ? 'show' : 'track';
        embedHtml = `<div class="my-4"><iframe src="https://open.spotify.com/embed/${type}/${spotifyMatch[1]}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" class="rounded-lg"></iframe></div>`;
      }
    }
    // Apple Podcasts
    else if (podcastUrl.includes('podcasts.apple.com')) {
      embedHtml = `<div class="my-4"><iframe src="${podcastUrl.replace('podcasts.apple.com', 'embed.podcasts.apple.com')}" height="175" frameborder="0" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; clipboard-write" class="w-full rounded-lg"></iframe></div>`;
    }
    // SoundCloud
    else if (podcastUrl.includes('soundcloud.com')) {
      embedHtml = `<div class="my-4"><iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(podcastUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" class="rounded-lg"></iframe></div>`;
    }
    // Deezer
    else if (podcastUrl.includes('deezer.com')) {
      const deezerMatch = podcastUrl.match(/(?:episode|podcast)\/(\d+)/);
      if (deezerMatch) {
        const type = podcastUrl.includes('/episode/') ? 'episode' : 'podcast';
        embedHtml = `<div class="my-4"><iframe src="https://widget.deezer.com/widget/dark/${type}/${deezerMatch[1]}" width="100%" height="152" frameborder="0" allow="encrypted-media; clipboard-write" class="rounded-lg"></iframe></div>`;
      }
    }
    
    if (embedHtml) {
      editor.chain().focus().insertContent(embedHtml).run();
      setPodcastUrl('');
      setShowPodcastDialog(false);
      toast.success('Podcast ajouté');
    } else {
      toast.error('URL de podcast non reconnue (Spotify, Apple Podcasts, SoundCloud, Deezer)');
    }
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
      {/* Toolbar Row 1 - Text formatting */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Text alignment */}
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
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
        
        {/* Emoji picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Émojis">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Picker 
              data={data} 
              onEmojiSelect={insertEmoji}
              locale="fr"
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
            />
          </PopoverContent>
        </Popover>
        
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
        
        <div className="w-px h-6 bg-border mx-1" />
        
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
      </div>
      
      <EditorContent editor={editor} />
      
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
      <Dialog open={showPodcastDialog} onOpenChange={setShowPodcastDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un podcast</DialogTitle>
          </DialogHeader>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPodcastDialog(false)}>
              Annuler
            </Button>
            <Button onClick={insertPodcast}>Insérer</Button>
          </DialogFooter>
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
            <Button variant="outline" onClick={() => setShowImageSettings(false)}>
              Annuler
            </Button>
            <Button onClick={applyImageSettings}>Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

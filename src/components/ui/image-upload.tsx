import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'uploads', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop volumineuse. Maximum 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="max-w-[200px] max-h-[150px] object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-24 border-dashed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Cliquer pour ajouter une image
            </>
          )}
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

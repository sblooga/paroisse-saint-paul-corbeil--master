import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Upload, Music, Play, Pause, Copy, Check } from 'lucide-react';

interface AudioFile {
  id: string;
  title: string;
  title_fr: string | null;
  title_pl: string | null;
  file_url: string;
  file_size: number | null;
  duration: number | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminAudioFiles = () => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingFile, setEditingFile] = useState<AudioFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<AudioFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    title_fr: '',
    title_pl: '',
    file_url: '',
    active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des fichiers audio');
      console.error(error);
    } else {
      setAudioFiles(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format audio non supporté (MP3, WAV, OGG, M4A)');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 50Mo)');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `podcasts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        file_url: urlData.publicUrl,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));

      toast.success('Fichier audio téléchargé');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
      console.error(error);
    }
    setUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCreateDialog = () => {
    setEditingFile(null);
    setFormData({
      title: '',
      title_fr: '',
      title_pl: '',
      file_url: '',
      active: true,
      sort_order: audioFiles.length,
    });
    setShowDialog(true);
  };

  const openEditDialog = (file: AudioFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      title_fr: file.title_fr || '',
      title_pl: file.title_pl || '',
      file_url: file.file_url,
      active: file.active,
      sort_order: file.sort_order,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.file_url.trim()) {
      toast.error('Le titre et le fichier audio sont requis');
      return;
    }

    try {
      if (editingFile) {
        const { error } = await supabase
          .from('audio_files')
          .update({
            title: formData.title,
            title_fr: formData.title_fr || null,
            title_pl: formData.title_pl || null,
            file_url: formData.file_url,
            active: formData.active,
            sort_order: formData.sort_order,
          })
          .eq('id', editingFile.id);

        if (error) throw error;
        toast.success('Fichier audio mis à jour');
      } else {
        const { error } = await supabase
          .from('audio_files')
          .insert({
            title: formData.title,
            title_fr: formData.title_fr || null,
            title_pl: formData.title_pl || null,
            file_url: formData.file_url,
            active: formData.active,
            sort_order: formData.sort_order,
          });

        if (error) throw error;
        toast.success('Fichier audio créé');
      }

      setShowDialog(false);
      fetchAudioFiles();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      // Extract file path from URL to delete from storage
      const url = new URL(fileToDelete.file_url);
      const pathMatch = url.pathname.match(/\/audio\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from('audio').remove([pathMatch[1]]);
      }

      const { error } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', fileToDelete.id);

      if (error) throw error;
      toast.success('Fichier audio supprimé');
      setShowDeleteDialog(false);
      setFileToDelete(null);
      fetchAudioFiles();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const toggleActive = async (file: AudioFile) => {
    try {
      const { error } = await supabase
        .from('audio_files')
        .update({ active: !file.active })
        .eq('id', file.id);

      if (error) throw error;
      fetchAudioFiles();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    }
  };

  const togglePlay = (file: AudioFile) => {
    if (playingId === file.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(file.file_url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(file.id);
    }
  };

  const copyAudioTag = (file: AudioFile) => {
    const title = isFrench ? (file.title_fr || file.title) : (file.title_pl || file.title);
    const audioHtml = `<div class="my-4 p-4 bg-muted/50 rounded-lg"><p class="font-medium mb-2">🎧 ${title}</p><audio controls class="w-full"><source src="${file.file_url}" type="audio/mpeg">Votre navigateur ne supporte pas l'audio.</audio></div>`;
    navigator.clipboard.writeText(audioHtml);
    setCopiedId(file.id);
    toast.success('Code HTML copié ! Collez-le dans l\'éditeur.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTitle = (file: AudioFile) => {
    if (isFrench) return file.title_fr || file.title;
    return file.title_pl || file.title;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-heading font-bold">
            Podcasts / Homélies
          </h2>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus size={16} />
          Ajouter un audio
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 Pour insérer un audio dans un article :</strong> Cliquez sur le bouton "Copier" puis collez le code dans l'éditeur de texte de l'article.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      ) : audioFiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun fichier audio</p>
          <p className="text-sm">Ajoutez vos premiers podcasts ou homélies</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="w-24">Écouter</TableHead>
                <TableHead className="w-24">Actif</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="w-40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audioFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-mono text-sm">
                    {file.sort_order}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{getTitle(file)}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {file.file_url.split('/').pop()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(file)}
                    >
                      {playingId === file.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={file.active}
                      onCheckedChange={() => toggleActive(file)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAudioTag(file)}
                        title="Copier le code HTML"
                      >
                        {copiedId === file.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(file)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFileToDelete(file);
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFile ? 'Modifier le fichier audio' : 'Ajouter un fichier audio'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label>Fichier audio</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={formData.file_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                  placeholder="URL du fichier audio..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formats: MP3, WAV, OGG, M4A (max 50Mo)
              </p>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du podcast/homélie"
              />
            </div>

            {/* Title FR */}
            <div>
              <Label htmlFor="title_fr">Titre (FR)</Label>
              <Input
                id="title_fr"
                value={formData.title_fr}
                onChange={(e) => setFormData(prev => ({ ...prev, title_fr: e.target.value }))}
                placeholder="Titre en français"
              />
            </div>

            {/* Title PL */}
            <div>
              <Label htmlFor="title_pl">Titre (PL)</Label>
              <Input
                id="title_pl"
                value={formData.title_pl}
                onChange={(e) => setFormData(prev => ({ ...prev, title_pl: e.target.value }))}
                placeholder="Tytuł po polsku"
              />
            </div>

            {/* Sort Order */}
            <div>
              <Label htmlFor="sort_order">Ordre d'affichage</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.file_url}>
              {editingFile ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce fichier audio ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le fichier sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAudioFiles;

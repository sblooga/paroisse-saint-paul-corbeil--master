import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, GripVertical, Facebook, Instagram, Youtube, MessageCircle, Camera, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';
import FlickrIcon from '@/components/icons/FlickrIcon';

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  sort_order: number | null;
  active: boolean | null;
}

const ICON_OPTIONS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'flickr', label: 'Flickr', icon: Camera },
  { value: 'twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'website', label: 'Site web', icon: Globe },
];

const getIconComponent = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'facebook': return <Facebook size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'youtube': return <Youtube size={size} />;
    case 'whatsapp': return <MessageCircle size={size} />;
    case 'flickr': return <FlickrIcon size={size} />;
    case 'twitter': return <Twitter size={size} />;
    case 'linkedin': return <Linkedin size={size} />;
    case 'github': return <Github size={size} />;
    default: return <Globe size={size} />;
  }
};

const AdminSocialLinks = () => {
  const { t } = useTranslation();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'facebook',
    url: '',
    sort_order: 0,
    active: true,
  });

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('social_links' as any)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error(t('admin.errors.fetchFailed'));
      console.error(error);
    } else {
      setLinks((data as unknown as SocialLink[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'facebook',
      url: '',
      sort_order: links.length,
      active: true,
    });
    setEditingLink(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      icon: link.icon,
      url: link.url,
      sort_order: link.sort_order || 0,
      active: link.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const linkData = {
      name: formData.name,
      icon: formData.icon,
      url: formData.url,
      sort_order: formData.sort_order,
      active: formData.active,
    };

    if (editingLink) {
      const { error } = await supabase
        .from('social_links' as any)
        .update(linkData)
        .eq('id', editingLink.id);

      if (error) {
        toast.error(t('admin.errors.updateFailed'));
        console.error(error);
      } else {
        toast.success(t('admin.success.updated'));
        fetchLinks();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('social_links' as any)
        .insert(linkData);

      if (error) {
        toast.error(t('admin.errors.createFailed'));
        console.error(error);
      } else {
        toast.success(t('admin.success.created'));
        fetchLinks();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;

    const { error } = await supabase
      .from('social_links' as any)
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(t('admin.errors.deleteFailed'));
      console.error(error);
    } else {
      toast.success(t('admin.success.deleted'));
      fetchLinks();
    }
  };

  const toggleActive = async (link: SocialLink) => {
    const { error } = await supabase
      .from('social_links' as any)
      .update({ active: !link.active })
      .eq('id', link.id);

    if (error) {
      toast.error(t('admin.errors.updateFailed'));
    } else {
      fetchLinks();
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">{t('admin.socialLinks.title', 'Réseaux sociaux')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus size={16} className="mr-2" />
              {t('admin.socialLinks.add', 'Ajouter')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? t('admin.socialLinks.edit', 'Modifier') : t('admin.socialLinks.add', 'Ajouter')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('admin.socialLinks.name', 'Nom')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Facebook, Instagram..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">{t('admin.socialLinks.icon', 'Icône')}</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getIconComponent(formData.icon, 16)}
                        {ICON_OPTIONS.find(o => o.value === formData.icon)?.label || formData.icon}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon size={16} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">{t('admin.socialLinks.url', 'URL')}</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">{t('admin.socialLinks.sortOrder', 'Ordre')}</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">{t('admin.socialLinks.active', 'Actif')}</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('admin.actions.cancel')}
                </Button>
                <Button type="submit">
                  {editingLink ? t('admin.actions.save') : t('admin.actions.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {links.map((link) => (
          <Card key={link.id} className={!link.active ? 'opacity-50' : ''}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <GripVertical size={20} className="text-muted-foreground" />
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {getIconComponent(link.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{link.name}</span>
                    <span className="text-xs text-muted-foreground">({link.sort_order})</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={link.active ?? true}
                  onCheckedChange={() => toggleActive(link)}
                />
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {links.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              {t('admin.socialLinks.empty', 'Aucun réseau social configuré')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSocialLinks;

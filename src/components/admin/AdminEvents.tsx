import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SpecialEvent {
  id: string;
  day_of_week: string;
  day_of_week_fr: string | null;
  day_of_week_pl: string | null;
  time: string;
  location: string | null;
  location_fr: string | null;
  location_pl: string | null;
  description: string | null;
  description_fr: string | null;
  description_pl: string | null;
  is_special: boolean;
  special_date: string | null;
  active: boolean;
  sort_order: number;
  language: string | null;
}

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [formData, setFormData] = useState({
    title_fr: '',
    title_pl: '',
    time: '',
    location_fr: '',
    location_pl: '',
    description_fr: '',
    description_pl: '',
    special_date: '',
    active: true,
    sort_order: 0,
    language: 'fr',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mass_schedules')
      .select('*')
      .eq('is_special', true)
      .order('special_date', { ascending: true });
    
    if (data) setEvents(data);
    if (error) console.error('Error fetching events:', error);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_pl: '',
      time: '',
      location_fr: '',
      location_pl: '',
      description_fr: '',
      description_pl: '',
      special_date: '',
      active: true,
      sort_order: 0,
      language: 'fr',
    });
    setEditingEvent(null);
  };

  const openEditDialog = (event: SpecialEvent) => {
    setEditingEvent(event);
    setFormData({
      title_fr: event.day_of_week_fr || event.day_of_week || '',
      title_pl: event.day_of_week_pl || '',
      time: event.time,
      location_fr: event.location_fr || event.location || '',
      location_pl: event.location_pl || '',
      description_fr: event.description_fr || event.description || '',
      description_pl: event.description_pl || '',
      special_date: event.special_date || '',
      active: event.active,
      sort_order: event.sort_order,
      language: event.language || 'fr',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_fr || !formData.time || !formData.special_date) {
      toast({ title: 'Erreur', description: 'Titre, heure et date requis', variant: 'destructive' });
      return;
    }

    const dataToSend = {
      day_of_week: formData.title_fr, // Using day_of_week to store the event title
      day_of_week_fr: formData.title_fr,
      day_of_week_pl: formData.title_pl || null,
      time: formData.time,
      location: formData.location_fr || null,
      location_fr: formData.location_fr || null,
      location_pl: formData.location_pl || null,
      description: formData.description_fr || null,
      description_fr: formData.description_fr || null,
      description_pl: formData.description_pl || null,
      is_special: true,
      special_date: formData.special_date,
      active: formData.active,
      sort_order: formData.sort_order,
      language: formData.language,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('mass_schedules')
        .update(dataToSend)
        .eq('id', editingEvent.id);
      
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Événement mis à jour' });
        fetchEvents();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('mass_schedules')
        .insert([dataToSend]);
      
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Événement ajouté' });
        fetchEvents();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('mass_schedules')
      .update({ active: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, active: !currentStatus } : e));
      toast({ title: currentStatus ? 'Événement désactivé' : 'Événement activé' });
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    
    const { error } = await supabase
      .from('mass_schedules')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Événement supprimé' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const isPast = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Star className="text-amber-500" size={24} />
          <h2 className="text-lg font-heading font-semibold">Événements spéciaux</h2>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} />
              Nouvel événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="special_date">Date de l'événement *</Label>
                  <Input
                    id="special_date"
                    type="date"
                    value={formData.special_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="10h30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Communauté *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Communauté française</SelectItem>
                    <SelectItem value="pl">🇵🇱 Wspólnota polska</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="pl">🇵🇱 Polski</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fr" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_fr">Titre de l'événement (FR) *</Label>
                    <Input
                      id="title_fr"
                      value={formData.title_fr}
                      onChange={(e) => setFormData(prev => ({ ...prev, title_fr: e.target.value }))}
                      placeholder="Messe de Noël, Veillée pascale..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_fr">Lieu (FR)</Label>
                    <Input
                      id="location_fr"
                      value={formData.location_fr}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_fr: e.target.value }))}
                      placeholder="Église principale..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_fr">Description (FR)</Label>
                    <Textarea
                      id="description_fr"
                      value={formData.description_fr}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_fr: e.target.value }))}
                      placeholder="Détails de l'événement..."
                      rows={3}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="pl" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_pl">Titre de l'événement (PL)</Label>
                    <Input
                      id="title_pl"
                      value={formData.title_pl}
                      onChange={(e) => setFormData(prev => ({ ...prev, title_pl: e.target.value }))}
                      placeholder="Msza Bożonarodzeniowa, Wigilia Paschalna..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_pl">Lieu (PL)</Label>
                    <Input
                      id="location_pl"
                      value={formData.location_pl}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_pl: e.target.value }))}
                      placeholder="Kościół główny..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_pl">Description (PL)</Label>
                    <Textarea
                      id="description_pl"
                      value={formData.description_pl}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_pl: e.target.value }))}
                      placeholder="Szczegóły wydarzenia..."
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Ordre d'affichage</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Actif</Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  <X size={16} />
                  Annuler
                </Button>
                <Button type="submit">
                  <Save size={16} />
                  {editingEvent ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Chargement...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-muted-foreground">Aucun événement spécial</p>
          <p className="text-sm text-muted-foreground mt-2">
            Cliquez sur "Nouvel événement" pour en créer un
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Communauté</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className={isPast(event.special_date) ? 'opacity-50' : ''}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    <span className="capitalize">{formatDate(event.special_date)}</span>
                  </div>
                </TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell className="font-medium">
                  {event.day_of_week_fr || event.day_of_week}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={event.language === 'pl' ? 'border-red-500 text-red-600' : 'border-blue-500 text-blue-600'}>
                    {event.language === 'pl' ? '🇵🇱 PL' : '🇫🇷 FR'}
                  </Badge>
                </TableCell>
                <TableCell>{event.location_fr || event.location || '-'}</TableCell>
                <TableCell>
                  {isPast(event.special_date) ? (
                    <Badge variant="secondary">Passé</Badge>
                  ) : event.active ? (
                    <Badge variant="default" className="bg-green-600">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Inactif</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(event.id, event.active)}>
                      {event.active ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
                      <Edit size={14} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminEvents;

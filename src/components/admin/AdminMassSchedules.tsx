import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
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

interface MassSchedule {
  id: string;
  day_of_week: string;
  time: string;
  location: string | null;
  description: string | null;
  is_special: boolean;
  special_date: string | null;
  active: boolean;
  sort_order: number;
}

const DAYS = [
  { value: 'lundi', label: 'Lundi' },
  { value: 'mardi', label: 'Mardi' },
  { value: 'mercredi', label: 'Mercredi' },
  { value: 'jeudi', label: 'Jeudi' },
  { value: 'vendredi', label: 'Vendredi' },
  { value: 'samedi', label: 'Samedi' },
  { value: 'dimanche', label: 'Dimanche' },
];

const AdminMassSchedules = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<MassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MassSchedule | null>(null);
  const [formData, setFormData] = useState({
    day_of_week: 'dimanche',
    time: '',
    location: '',
    description: '',
    is_special: false,
    special_date: '',
    active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mass_schedules')
      .select('*')
      .order('sort_order')
      .order('day_of_week');
    
    if (data) setSchedules(data);
    if (error) console.error('Error fetching schedules:', error);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      day_of_week: 'dimanche',
      time: '',
      location: '',
      description: '',
      is_special: false,
      special_date: '',
      active: true,
      sort_order: 0,
    });
    setEditingSchedule(null);
  };

  const openEditDialog = (schedule: MassSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      day_of_week: schedule.day_of_week,
      time: schedule.time,
      location: schedule.location || '',
      description: schedule.description || '',
      is_special: schedule.is_special,
      special_date: schedule.special_date || '',
      active: schedule.active,
      sort_order: schedule.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.day_of_week || !formData.time) {
      toast({ title: 'Erreur', description: 'Jour et heure requis', variant: 'destructive' });
      return;
    }

    const dataToSend = {
      ...formData,
      location: formData.location || null,
      description: formData.description || null,
      special_date: formData.special_date || null,
    };

    if (editingSchedule) {
      const { error } = await supabase
        .from('mass_schedules')
        .update(dataToSend)
        .eq('id', editingSchedule.id);
      
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Horaire mis à jour' });
        fetchSchedules();
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
        toast({ title: 'Horaire ajouté' });
        fetchSchedules();
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
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !currentStatus } : s));
      toast({ title: currentStatus ? 'Horaire désactivé' : 'Horaire activé' });
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Supprimer cet horaire ?')) return;
    
    const { error } = await supabase
      .from('mass_schedules')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Horaire supprimé' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const getDayLabel = (value: string) => {
    return DAYS.find(d => d.value === value)?.label || value;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-heading font-semibold">Horaires des messes</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} />
              Nouvel horaire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Modifier l\'horaire' : 'Nouvel horaire'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Jour *</Label>
                  <Select
                    value={formData.day_of_week}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="10h30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Église principale..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Messe en français, Messe anticipée..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Ordre</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special_date">Date spéciale</Label>
                  <Input
                    id="special_date"
                    type="date"
                    value={formData.special_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_special"
                    checked={formData.is_special}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_special: checked }))}
                  />
                  <Label htmlFor="is_special">Messe spéciale</Label>
                </div>
                <div className="flex items-center gap-2">
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
                  {editingSchedule ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Chargement...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jour</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun horaire
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{getDayLabel(schedule.day_of_week)}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.location || '-'}</TableCell>
                  <TableCell>
                    {schedule.is_special ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">Spéciale</Badge>
                    ) : (
                      <Badge variant="outline">Régulière</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {schedule.active ? (
                      <Badge variant="default" className="bg-green-600">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleActive(schedule.id, schedule.active)}>
                        {schedule.active ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(schedule)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminMassSchedules;

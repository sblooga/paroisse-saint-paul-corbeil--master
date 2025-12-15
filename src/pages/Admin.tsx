import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Users, MessageSquare, LogOut, Trash2, Eye, 
  Check, X, RefreshCw, LayoutDashboard, FileText, 
  Calendar, UsersRound, Newspaper
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminPages from '@/components/admin/AdminPages';
import AdminTeam from '@/components/admin/AdminTeam';
import AdminMassSchedules from '@/components/admin/AdminMassSchedules';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter_optin: boolean;
  read: boolean;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  consent_date: string;
}

type TabType = 'messages' | 'subscribers' | 'articles' | 'pages' | 'team' | 'schedules';

const Admin = () => {
  const { user, isLoading, isEditor, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isEditor) {
      fetchData();
    }
  }, [user, isEditor]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [messagesRes, subscribersRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('consent_date', { ascending: false }),
      ]);

      if (messagesRes.data) setMessages(messagesRes.data);
      if (subscribersRes.data) setSubscribers(subscribersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      toast({ title: 'Message marqué comme lu' });
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Message supprimé' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de supprimer ce message.', variant: 'destructive' });
    }
  };

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, active: !currentStatus } : s));
      toast({ title: currentStatus ? 'Abonné désactivé' : 'Abonné réactivé' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4">
        <div className="card-parish p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Accès restreint
          </h2>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
            Contactez un administrateur pour obtenir l'accès.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Retour au site
            </Button>
            <Button onClick={handleSignOut} variant="destructive">
              <LogOut size={18} />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">
                Tableau de bord
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw size={16} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Voir le site
            </Button>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-parish p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-parish p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Mail className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {messages.filter(m => !m.read).length}
                </p>
                <p className="text-sm text-muted-foreground">Non lus</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-parish p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Users className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
                <p className="text-sm text-muted-foreground">Abonnés newsletter</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-parish p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {subscribers.filter(s => s.active).length}
                </p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'articles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('articles')}
            size="sm"
          >
            <Newspaper size={16} />
            Articles
          </Button>
          <Button
            variant={activeTab === 'pages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pages')}
            size="sm"
          >
            <FileText size={16} />
            Pages
          </Button>
          <Button
            variant={activeTab === 'team' ? 'default' : 'outline'}
            onClick={() => setActiveTab('team')}
            size="sm"
          >
            <UsersRound size={16} />
            Équipe
          </Button>
          <Button
            variant={activeTab === 'schedules' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schedules')}
            size="sm"
          >
            <Calendar size={16} />
            Messes
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
            size="sm"
          >
            <MessageSquare size={16} />
            Messages ({messages.length})
          </Button>
          <Button
            variant={activeTab === 'subscribers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('subscribers')}
            size="sm"
          >
            <Users size={16} />
            Newsletter ({subscribers.length})
          </Button>
        </div>

        {/* Content */}
        <div className="card-parish overflow-hidden">
          {activeTab === 'articles' && <AdminArticles />}
          {activeTab === 'pages' && <AdminPages />}
          {activeTab === 'team' && <AdminTeam />}
          {activeTab === 'schedules' && <AdminMassSchedules />}
          {activeTab === 'messages' && (
            loadingData ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statut</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Newsletter</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun message reçu
                      </TableCell>
                    </TableRow>
                  ) : (
                    messages.map((msg) => (
                      <TableRow key={msg.id} className={!msg.read ? 'bg-primary/5' : ''}>
                        <TableCell>
                          {msg.read ? (
                            <Badge variant="secondary">Lu</Badge>
                          ) : (
                            <Badge variant="default">Nouveau</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
                        <TableCell className="text-sm">{formatDate(msg.created_at)}</TableCell>
                        <TableCell>
                          {msg.newsletter_optin ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <X size={18} className="text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!msg.read && (
                              <Button size="sm" variant="outline" onClick={() => markAsRead(msg.id)}>
                                <Eye size={14} />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteMessage(msg.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )
          )}
          {activeTab === 'subscribers' && (
            loadingData ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucun abonné à la newsletter
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.email}</TableCell>
                        <TableCell>{formatDate(sub.consent_date)}</TableCell>
                        <TableCell>
                          {sub.active ? (
                            <Badge variant="default" className="bg-green-600">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={sub.active ? 'outline' : 'default'}
                            onClick={() => toggleSubscriberStatus(sub.id, sub.active)}
                          >
                            {sub.active ? 'Désactiver' : 'Réactiver'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;

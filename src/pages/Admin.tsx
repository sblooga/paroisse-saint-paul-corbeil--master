import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Users, MessageSquare, LogOut, 
  Check, RefreshCw, LayoutDashboard, FileText, 
  Calendar, UsersRound, Newspaper
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminPages from '@/components/admin/AdminPages';
import AdminTeam from '@/components/admin/AdminTeam';
import AdminMassSchedules from '@/components/admin/AdminMassSchedules';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminNewsletter from '@/components/admin/AdminNewsletter';

type TabType = 'messages' | 'subscribers' | 'articles' | 'pages' | 'team' | 'schedules';

interface Stats {
  messages: number;
  unread: number;
  subscribers: number;
  activeSubscribers: number;
}

const Admin = () => {
  const { user, isLoading, isEditor, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  const [stats, setStats] = useState<Stats>({ messages: 0, unread: 0, subscribers: 0, activeSubscribers: 0 });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isEditor) {
      fetchStats();
    }
  }, [user, isEditor]);

  const fetchStats = async () => {
    try {
      const [messagesRes, subscribersRes] = await Promise.all([
        supabase.from('contact_messages').select('id, read'),
        supabase.from('newsletter_subscribers').select('id, active'),
      ]);

      setStats({
        messages: messagesRes.data?.length || 0,
        unread: messagesRes.data?.filter(m => !m.read).length || 0,
        subscribers: subscribersRes.data?.length || 0,
        activeSubscribers: subscribersRes.data?.filter(s => s.active).length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            <Button variant="outline" size="sm" onClick={fetchStats}>
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
                <p className="text-2xl font-bold text-foreground">{stats.messages}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.unread}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.subscribers}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.activeSubscribers}</p>
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
            Messages {stats.unread > 0 && `(${stats.unread})`}
          </Button>
          <Button
            variant={activeTab === 'subscribers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('subscribers')}
            size="sm"
          >
            <Users size={16} />
            Newsletter ({stats.subscribers})
          </Button>
        </div>

        {/* Content */}
        <div className="card-parish overflow-hidden">
          {activeTab === 'articles' && <AdminArticles />}
          {activeTab === 'pages' && <AdminPages />}
          {activeTab === 'team' && <AdminTeam />}
          {activeTab === 'schedules' && <AdminMassSchedules />}
          {activeTab === 'messages' && <AdminMessages />}
          {activeTab === 'subscribers' && <AdminNewsletter />}
        </div>
      </main>
    </div>
  );
};

export default Admin;

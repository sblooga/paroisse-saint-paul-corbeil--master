import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  sort_order: number;
}

const CATEGORY_ORDER = ['priests', 'team', 'services', 'secretariat', 'choir'];
const CATEGORY_LABELS: Record<string, string> = {
  priests: 'Prêtres',
  team: 'Équipe animatrice',
  services: 'Services',
  secretariat: 'Secrétariat',
  choir: 'Chorale',
};

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (data) setMembers(data);
    if (error) console.error('Error fetching team members:', error);
    setLoading(false);
  };

  const groupedMembers = CATEGORY_ORDER.reduce((acc, category) => {
    const categoryMembers = members.filter(m => m.category === category);
    if (categoryMembers.length > 0) {
      acc[category] = categoryMembers;
    }
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="container-parish text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Notre communauté
              </span>
              <h1 className="mt-2 text-foreground">L'Équipe Paroissiale</h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                Une équipe dévouée au service de la communauté, pour vous accueillir et 
                vous accompagner dans votre vie de foi.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Members */}
        <section className="section-padding">
          <div className="container-parish">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-parish p-6 text-center">
                    <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto mb-4" />
                    <div className="flex justify-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Aucun membre de l'équipe pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(groupedMembers).map(([category, categoryMembers], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  >
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
                      {CATEGORY_LABELS[category] || category}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="card-parish p-6 text-center group"
                        >
                          <div className="relative mb-4 mx-auto w-28 h-28">
                            {member.photo_url ? (
                              <img
                                src={member.photo_url}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover border-4 border-accent shadow-lg group-hover:border-primary transition-colors"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-muted border-4 border-accent shadow-lg flex items-center justify-center text-2xl font-bold text-muted-foreground">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-heading font-bold text-foreground mt-4">
                            {member.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">{member.role}</p>
                          
                          {member.bio && (
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {member.bio}
                            </p>
                          )}

                          <div className="flex justify-center gap-3 mt-4">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label={`Envoyer un email à ${member.name}`}
                              >
                                <Mail size={18} />
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="p-2 bg-secondary/20 rounded-full text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
                                aria-label={`Appeler ${member.name}`}
                              >
                                <Phone size={18} />
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                                aria-label={`Contacter ${member.name} sur WhatsApp`}
                              >
                                <MessageCircle size={18} />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-muted">
          <div className="container-parish text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Une question ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                N'hésitez pas à nous contacter, notre équipe est là pour vous accompagner.
              </p>
              <Link to="/contact" className="btn-parish">
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;

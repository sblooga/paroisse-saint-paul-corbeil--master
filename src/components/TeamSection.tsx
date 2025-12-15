import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  priests: 'Prêtres',
  team: 'Équipe animatrice',
  services: 'Services',
  secretariat: 'Secrétariat',
  choir: 'Chorale',
};

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, category, photo_url, email, phone')
      .eq('active', true)
      .order('sort_order')
      .limit(6);

    if (data) setMembers(data);
    if (error) console.error('Error fetching team members:', error);
    setLoading(false);
  };

  return (
    <section id="equipes" className="section-padding bg-muted">
      <div className="container-parish">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            Notre communauté
          </span>
          <h2 className="mt-2 text-foreground">L'Équipe Paroissiale</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Une équipe dévouée au service de la communauté, pour vous accueillir et 
            vous accompagner dans votre vie de foi.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-parish p-6 text-center">
                <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-4" />
                <div className="flex justify-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun membre de l'équipe pour le moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
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
                    <div className="w-full h-full rounded-full bg-background border-4 border-accent shadow-lg flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full whitespace-nowrap">
                    {CATEGORY_LABELS[member.category] || member.category}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-foreground mt-4">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{member.role}</p>

                <div className="flex justify-center gap-3">
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
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link to="/equipe" className="btn-parish">
            Découvrir toute l'équipe
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;

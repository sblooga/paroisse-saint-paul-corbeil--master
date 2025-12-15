import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    id: 1,
    name: 'Père Jean-Marie',
    role: 'Curé de la paroisse',
    category: 'Prêtres',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    email: 'cure@paroisse-stpaul.fr',
    phone: '+33 1 23 45 67 89',
  },
  {
    id: 2,
    name: 'Père Thomas',
    role: 'Vicaire',
    category: 'Prêtres',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    email: 'vicaire@paroisse-stpaul.fr',
  },
  {
    id: 3,
    name: 'Marie Dupont',
    role: 'Secrétaire paroissiale',
    category: 'Secrétariat',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    email: 'secretariat@paroisse-stpaul.fr',
    phone: '+33 1 23 45 67 80',
  },
  {
    id: 4,
    name: 'Pierre Martin',
    role: 'Président du Conseil Pastoral',
    category: 'Équipe animatrice',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    email: 'conseil@paroisse-stpaul.fr',
  },
  {
    id: 5,
    name: 'Sophie Laurent',
    role: 'Responsable Catéchèse',
    category: 'Services',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    email: 'catechese@paroisse-stpaul.fr',
  },
  {
    id: 6,
    name: 'François Dubois',
    role: 'Chef de Chorale',
    category: 'Chorale',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face',
    email: 'chorale@paroisse-stpaul.fr',
  },
];

const TeamSection = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card-parish p-6 text-center group"
            >
              <div className="relative mb-4 mx-auto w-28 h-28">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover border-4 border-accent shadow-lg group-hover:border-primary transition-colors"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full whitespace-nowrap">
                  {member.category}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a href="#" className="btn-parish">
            Découvrir tous les services
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;

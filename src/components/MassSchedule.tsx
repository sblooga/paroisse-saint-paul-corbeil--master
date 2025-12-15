import { Clock, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const schedules = [
  {
    day: 'Dimanche',
    times: ['9h00', '11h00', '18h30'],
    location: 'Église Saint-Paul',
    type: 'Messe dominicale',
  },
  {
    day: 'Samedi',
    times: ['18h00'],
    location: 'Église Saint-Paul',
    type: 'Messe anticipée',
  },
  {
    day: 'En semaine',
    times: ['8h30 (Mar, Jeu)', '18h30 (Mer, Ven)'],
    location: 'Chapelle',
    type: 'Messe quotidienne',
  },
];

const MassSchedule = () => {
  return (
    <section id="horaires" className="section-padding bg-muted">
      <div className="container-parish">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Venez prier avec nous
          </span>
          <h2 className="mt-2 text-foreground">Horaires des Messes</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Retrouvez les horaires de toutes nos célébrations. Les confessions sont 
            possibles avant chaque messe ou sur rendez-vous.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-parish p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {schedule.day}
                  </h3>
                  <p className="text-sm text-muted-foreground">{schedule.type}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-accent mt-0.5" />
                  <div>
                    {schedule.times.map((time, i) => (
                      <p key={i} className="text-foreground font-medium">
                        {time}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-secondary" />
                  <p className="text-muted-foreground">{schedule.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground mb-4">
            📢 Horaires susceptibles de modifications lors des fêtes liturgiques
          </p>
          <a href="#contact" className="btn-parish">
            Voir le calendrier complet
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MassSchedule;

import { ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: 'Préparation à Noël : Temps de l\'Avent',
    excerpt: 'Découvrez le programme de nos célébrations et activités pour ce temps de préparation spirituelle à la naissance du Sauveur.',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop',
    date: '15 Décembre 2024',
    category: 'Liturgie',
  },
  {
    id: 2,
    title: 'Nouvelle équipe de catéchèse',
    excerpt: 'Bienvenue à nos nouveaux catéchistes qui accompagneront les enfants dans leur découverte de la foi cette année.',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&h=400&fit=crop',
    date: '10 Décembre 2024',
    category: 'Vie paroissiale',
  },
  {
    id: 3,
    title: 'Concert de la chorale paroissiale',
    excerpt: 'Ne manquez pas notre traditionnel concert de Noël le 22 décembre à 20h30. Entrée libre, participation aux frais.',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop',
    date: '5 Décembre 2024',
    category: 'Événement',
  },
];

const FeaturedArticles = () => {
  return (
    <section id="actualites" className="section-padding bg-background">
      <div className="container-parish">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
            Restez informés
          </span>
          <h2 className="mt-2 text-foreground">À la Une</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Toutes les dernières nouvelles de notre communauté paroissiale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-parish group"
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <CalendarIcon size={14} />
                  <time>{article.date}</time>
                </div>

                <h3 className="text-xl font-heading font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {article.excerpt}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Lire la suite
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a href="#" className="btn-parish-outline">
            Voir toutes les actualités
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedArticles;

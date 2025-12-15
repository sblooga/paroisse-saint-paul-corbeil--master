import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', articleSlug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article:', error);
    }
    
    if (data) {
      setArticle(data);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container-parish max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="aspect-video w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container-parish text-center py-16">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
              Article non trouvé
            </h1>
            <p className="text-muted-foreground mb-8">
              Cet article n'existe pas ou n'est plus disponible.
            </p>
            <Link to="/articles" className="btn-parish">
              <ArrowLeft size={18} />
              Retour aux actualités
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <article className="section-padding">
          <div className="container-parish max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                Retour aux actualités
              </Link>

              {article.category && (
                <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full mb-4">
                  {article.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  <time>{formatDate(article.created_at)}</time>
                </div>
              </div>

              {article.image_url && (
                <div className="relative overflow-hidden rounded-xl mb-8">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              {article.content ? (
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : article.excerpt ? (
                <p className="text-lg text-muted-foreground">{article.excerpt}</p>
              ) : (
                <p className="text-muted-foreground italic">Aucun contenu disponible.</p>
              )}
            </motion.div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;

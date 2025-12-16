import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { sanitizeHtml } from '@/lib/sanitize';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  title_fr: string | null;
  title_pl: string | null;
  content_fr: string | null;
  content_pl: string | null;
  excerpt_fr: string | null;
  excerpt_pl: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'fr';

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
      setArticle(data as Article);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getLocalizedTitle = (article: Article) => {
    if (currentLang === 'pl' && article.title_pl) return article.title_pl;
    return article.title_fr || article.title;
  };

  const getLocalizedContent = (article: Article) => {
    if (currentLang === 'pl' && article.content_pl) return article.content_pl;
    return article.content_fr || article.content;
  };

  const getLocalizedExcerpt = (article: Article) => {
    if (currentLang === 'pl' && article.excerpt_pl) return article.excerpt_pl;
    return article.excerpt_fr || article.excerpt;
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
              {t('articles.notFound')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('articles.notFoundDesc')}
            </p>
            <Link to="/articles" className="btn-parish">
              <ArrowLeft size={18} />
              {t('articles.backToArticles')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const content = getLocalizedContent(article);
  const excerpt = getLocalizedExcerpt(article);

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
                {t('articles.backToArticles')}
              </Link>

              {article.category && (
                <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full mb-4">
                  {article.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {getLocalizedTitle(article)}
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
                    alt={getLocalizedTitle(article)}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              {content ? (
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                />
              ) : excerpt ? (
                <p className="text-lg text-muted-foreground">{excerpt}</p>
              ) : (
                <p className="text-muted-foreground italic">{t('articles.noContent')}</p>
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
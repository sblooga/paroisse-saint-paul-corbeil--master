import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Skeleton } from '@/components/ui/skeleton';
import { sanitizeHtml } from '@/lib/sanitize';

interface PageData {
  title_fr: string | null;
  title_pl: string | null;
  content_fr: string | null;
  content_pl: string | null;
  meta_title_fr: string | null;
  meta_title_pl: string | null;
  meta_description_fr: string | null;
  meta_description_pl: string | null;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('pages')
        .select('title_fr, title_pl, content_fr, content_pl, meta_title_fr, meta_title_pl, meta_description_fr, meta_description_pl')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPageData(data);
        
        // Update document title
        const metaTitle = isFrench ? data.meta_title_fr : data.meta_title_pl;
        const title = isFrench ? data.title_fr : data.title_pl;
        document.title = metaTitle || title || 'Page';
        
        // Update meta description
        const metaDesc = isFrench ? data.meta_description_fr : data.meta_description_pl;
        if (metaDesc) {
          let descMeta = document.querySelector('meta[name="description"]');
          if (!descMeta) {
            descMeta = document.createElement('meta');
            descMeta.setAttribute('name', 'description');
            document.head.appendChild(descMeta);
          }
          descMeta.setAttribute('content', metaDesc);
        }
      }
      setLoading(false);
    };

    fetchPage();
  }, [slug, isFrench]);

  // Redirect to 404 if page not found
  useEffect(() => {
    if (notFound && !loading) {
      navigate('/404', { replace: true });
    }
  }, [notFound, loading, navigate]);

  const title = isFrench 
    ? pageData?.title_fr
    : pageData?.title_pl;

  const content = isFrench 
    ? pageData?.content_fr
    : pageData?.content_pl;

  if (notFound) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <>
              <Skeleton className="h-12 w-3/4 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/5" />
              </div>
            </>
          ) : (
            <>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
                {title || (isFrench ? 'Page sans titre' : 'Strona bez tytułu')}
              </h1>

              {content ? (
                <div 
                  className="prose prose-lg max-w-none text-foreground/80 
                    [&_h1]:font-playfair [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:mt-8
                    [&_h2]:font-playfair [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-8
                    [&_h3]:font-playfair [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:font-lato [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                    [&_li]:font-lato [&_li]:text-foreground/80
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic
                    [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-6"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                />
              ) : (
                <p className="text-foreground/60 font-lato">
                  {isFrench 
                    ? 'Contenu non disponible.'
                    : 'Treść niedostępna.'}
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default DynamicPage;

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Users, BookOpen, Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  type: 'article' | 'page' | 'team';
  url: string;
  subtitle?: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const lang = i18n.language;

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, slug, title, title_fr, title_pl, excerpt, excerpt_fr, excerpt_pl')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,title_fr.ilike.%${searchQuery}%,title_pl.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .limit(5);

      if (articles) {
        articles.forEach((article) => {
          const title = lang === 'fr' ? (article.title_fr || article.title) : 
                        lang === 'pl' ? (article.title_pl || article.title) : article.title;
          const excerpt = lang === 'fr' ? (article.excerpt_fr || article.excerpt) :
                          lang === 'pl' ? (article.excerpt_pl || article.excerpt) : article.excerpt;
          searchResults.push({
            id: article.id,
            title,
            type: 'article',
            url: `/articles/${article.slug}`,
            subtitle: excerpt?.substring(0, 60) + (excerpt && excerpt.length > 60 ? '...' : ''),
          });
        });
      }

      // Search pages
      const { data: pages } = await supabase
        .from('pages')
        .select('id, slug, title, title_fr, title_pl, meta_description, meta_description_fr, meta_description_pl')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,title_fr.ilike.%${searchQuery}%,title_pl.ilike.%${searchQuery}%`)
        .limit(5);

      if (pages) {
        pages.forEach((page) => {
          const title = lang === 'fr' ? (page.title_fr || page.title) :
                        lang === 'pl' ? (page.title_pl || page.title) : page.title;
          const desc = lang === 'fr' ? (page.meta_description_fr || page.meta_description) :
                       lang === 'pl' ? (page.meta_description_pl || page.meta_description) : page.meta_description;
          searchResults.push({
            id: page.id,
            title,
            type: 'page',
            url: `/${page.slug}`,
            subtitle: desc?.substring(0, 60) + (desc && desc.length > 60 ? '...' : ''),
          });
        });
      }

      // Search team members
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('id, name, name_fr, name_pl, role, role_fr, role_pl')
        .eq('active', true)
        .or(`name.ilike.%${searchQuery}%,name_fr.ilike.%${searchQuery}%,name_pl.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`)
        .limit(5);

      if (teamMembers) {
        teamMembers.forEach((member) => {
          const name = lang === 'fr' ? (member.name_fr || member.name) :
                       lang === 'pl' ? (member.name_pl || member.name) : member.name;
          const role = lang === 'fr' ? (member.role_fr || member.role) :
                       lang === 'pl' ? (member.role_pl || member.role) : member.role;
          searchResults.push({
            id: member.id,
            title: name,
            type: 'team',
            url: '/equipe',
            subtitle: role,
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, search]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (url: string) => {
    navigate(url);
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  const getIcon = (type: 'article' | 'page' | 'team') => {
    switch (type) {
      case 'article':
        return <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />;
      case 'page':
        return <FileText className="mr-2 h-4 w-4 text-muted-foreground" />;
      case 'team':
        return <Users className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: 'article' | 'page' | 'team') => {
    switch (type) {
      case 'article':
        return t('search.articles', 'Articles');
      case 'page':
        return t('search.pages', 'Pages');
      case 'team':
        return t('search.team', 'Équipe');
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('search.placeholder', 'Rechercher...')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Search className="h-4 w-4 animate-pulse mr-2" />
              {t('search.loading', 'Recherche en cours...')}
            </div>
          ) : query ? (
            t('search.noResults', 'Aucun résultat trouvé.')
          ) : (
            t('search.hint', 'Tapez pour rechercher...')
          )}
        </CommandEmpty>

        {Object.entries(groupedResults).map(([type, items]) => (
          <CommandGroup key={type} heading={getTypeLabel(type as 'article' | 'page' | 'team')}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item.url)}
                className="cursor-pointer"
              >
                {getIcon(item.type)}
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {item.subtitle && (
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;

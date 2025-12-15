import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface MassSchedule {
  id: string;
  day_of_week: string;
  time: string;
  location: string | null;
  description: string | null;
  is_special: boolean;
  sort_order: number;
}

const DAY_ORDER = ['Dimanche', 'Samedi', 'En semaine'];

const MassScheduleSection = () => {
  const { t, i18n } = useTranslation();
  const [schedules, setSchedules] = useState<MassSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'fr';

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('mass_schedules')
      .select('*')
      .eq('active', true)
      .eq('is_special', false)
      .order('sort_order')
      .limit(9);

    if (data) setSchedules(data);
    if (error) console.error('Error fetching schedules:', error);
    setLoading(false);
  };

  // Group schedules by day type
  const groupedSchedules = DAY_ORDER.reduce((acc, dayType) => {
    let daySchedules: MassSchedule[];
    
    if (dayType === 'Dimanche') {
      daySchedules = schedules.filter(s => s.day_of_week === 'Dimanche');
    } else if (dayType === 'Samedi') {
      daySchedules = schedules.filter(s => s.day_of_week === 'Samedi');
    } else {
      daySchedules = schedules.filter(s => 
        !['Dimanche', 'Samedi'].includes(s.day_of_week)
      );
    }
    
    if (daySchedules.length > 0) {
      acc.push({
        day: dayType,
        schedules: daySchedules,
        type: dayType === 'Dimanche' ? t('massSchedule.sundayMass') : 
              dayType === 'Samedi' ? t('massSchedule.saturdayMass') : 
              t('massSchedule.weekdayMass'),
      });
    }
    return acc;
  }, [] as { day: string; schedules: MassSchedule[]; type: string }[]);

  const getDayLabel = (day: string) => {
    if (day === 'En semaine') return t('massSchedule.weekdays');
    const dayMap: Record<string, string> = {
      'Dimanche': t('massSchedule.sunday'),
      'Samedi': t('massSchedule.saturday'),
    };
    return dayMap[day] || day;
  };

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
            {t('massSchedule.cta')}
          </span>
          <h2 className="mt-2 text-foreground">{t('massSchedule.title')}</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t('massSchedule.description')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-parish p-6">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : groupedSchedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('massSchedule.noSchedules')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {groupedSchedules.map((group, index) => (
              <motion.div
                key={group.day}
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
                      {getDayLabel(group.day)}
                    </h3>
                    <p className="text-sm text-muted-foreground">{group.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {group.schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-start gap-3">
                      <Clock size={18} className="text-accent mt-0.5" />
                      <div>
                        <p className="text-foreground font-medium">
                          {schedule.time}
                          {schedule.day_of_week !== group.day && group.day === 'En semaine' && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({schedule.day_of_week.slice(0, 3)})
                            </span>
                          )}
                        </p>
                        {schedule.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground mb-4">
            {t('massSchedule.notice')}
          </p>
          <Link to="/horaires" className="btn-parish">
            {t('massSchedule.viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MassScheduleSection;
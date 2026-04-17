import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import SEOHead from '../components/SEOHead';
import Spinner from '../components/Spinner';
import { useAsync, useDebounce } from '../hooks/useAsync';
import { fetchCourses } from '../lib/api';
import { DOMAINS } from '../data/mockData';
import styles from './Courses.module.css';

const DURATIONS = ['Under 4 weeks', '4–8 weeks', '8+ weeks'];

export default function Courses() {
  const [search, setSearch] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [sort, setSort] = useState('popular');

  const debouncedSearch = useDebounce(search, 300);
  const { data: courses, loading, error } = useAsync(fetchCourses);
  console.log(courses)
  const toggleDomain = (id) =>
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );

  const filtered = useMemo(() => {
    if (!courses) return [];
    let list = [...courses];
    if (debouncedSearch)
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.instructor.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    if (selectedDomains.length) list = list.filter((c) => selectedDomains.includes(c.domainId));
    if (selectedDuration === 'Under 4 weeks') list = list.filter((c) => c.weeks < 4);
    if (selectedDuration === '4–8 weeks') list = list.filter((c) => c.weeks >= 4 && c.weeks <= 8);
    if (selectedDuration === '8+ weeks') list = list.filter((c) => c.weeks > 8);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'popular') list.sort((a, b) => b.enrolled - a.enrolled);
    return list;
  }, [courses, debouncedSearch, selectedDomains, selectedDuration, sort]);

  return (
    <>
      <SEOHead title="Browse Courses" description="Explore 180+ free courses in Computer Science, AI, Data Science, Electronics and more." path="/courses" />

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1>All Courses</h1>
          <p>180+ courses across 12 domains · New courses added every month</p>
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search courses or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search courses"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Filters">
          <div className={styles.filterCard}>
            <div className={styles.filterTitle}><SlidersHorizontal size={14} /> Domain</div>
            {DOMAINS.map((d) => (
              <label key={d.id} className={styles.filterItem}>
                <input type="checkbox" checked={selectedDomains.includes(d.id)} onChange={() => toggleDomain(d.id)} />
                <span>{d.name}</span>
                <span className={styles.filterCount}>{d.count}</span>
              </label>
            ))}
          </div>
          <div className={styles.filterCard}>
            <div className={styles.filterTitle}>Duration</div>
            {DURATIONS.map((d) => (
              <label key={d} className={styles.filterItem}>
                <input type="radio" name="duration" checked={selectedDuration === d} onChange={() => setSelectedDuration(selectedDuration === d ? '' : d)} />
                <span>{d}</span>
              </label>
            ))}
          </div>
          {(selectedDomains.length > 0 || selectedDuration) && (
            <button className={styles.clearBtn} onClick={() => { setSelectedDomains([]); setSelectedDuration(''); }}>
              Clear filters
            </button>
          )}
        </aside>

        <main className={styles.main}>
          <div className={styles.resultsBar}>
            <span className={styles.count}>
              {loading ? 'Loading...' : <>Showing <strong>{filtered.length}</strong> courses</>}
            </span>
            <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort courses">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {loading && <Spinner center />}

          {error && (
            <div className={styles.errorMsg}>
              Failed to load courses. Please try again.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.empty}>
              <p>No courses match your filters.</p>
              <button className={styles.clearBtn} onClick={() => { setSearch(''); setSelectedDomains([]); setSelectedDuration(''); }}>
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className={styles.grid}>
              {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

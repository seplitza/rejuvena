import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

interface Exercise {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  tags: any[];
  updatedAt: string;
}

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const response = await api.get('/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это упражнение?')) return;

    try {
      await api.delete(`/exercises/${id}`);
      setExercises(exercises.filter(e => e._id !== id));
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      alert('Ошибка при удалении');
    }
  };

  const filteredExercises = exercises.filter(e => {
    if (filter === 'published') return e.isPublished;
    if (filter === 'draft') return !e.isPublished;
    return true;
  });

  if (loading) {
    return <div style={{ padding: '40px' }}>Загрузка...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Упражнения</h1>
        <Link
          to="/exercises/new"
          style={{
            padding: '12px 24px',
            background: '#4F46E5',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          + Создать упражнение
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        {(['all', 'published', 'draft'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: filter === f ? 'none' : '1px solid #D1D5DB',
              background: filter === f ? '#4F46E5' : 'white',
              color: filter === f ? 'white' : '#374151',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {f === 'all' ? 'Все' : f === 'published' ? 'Опубликованные' : 'Черновики'}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredExercises.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '12px',
            color: '#6B7280'
          }}>
            Упражнений не найдено
          </div>
        ) : (
          filteredExercises.map(exercise => (
            <div
              key={exercise._id}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{exercise.title}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: exercise.isPublished ? '#D1FAE5' : '#FEE2E2',
                    color: exercise.isPublished ? '#065F46' : '#991B1B'
                  }}>
                    {exercise.isPublished ? 'Опубликовано' : 'Черновик'}
                  </span>
                </div>
                <p style={{ color: '#6B7280', marginBottom: '12px' }}>
                  {exercise.description.substring(0, 150)}
                  {exercise.description.length > 150 && '...'}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {exercise.tags.map((tag: any) => (
                    <span
                      key={tag._id}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: tag.color + '20',
                        color: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <Link
                  to={`/exercises/${exercise._id}`}
                  style={{
                    padding: '8px 16px',
                    background: '#4F46E5',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(exercise._id)}
                  style={{
                    padding: '8px 16px',
                    background: '#DC2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

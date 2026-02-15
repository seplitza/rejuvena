import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
  content: string;
  isPrivate: boolean;
  likes: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  exerciseId?: string;
  marathonId?: string;
  marathonDayNumber?: number;
  context?: 'exercise' | 'marathon-day';
}

export default function CommentSection({
  exerciseId,
  marathonId,
  marathonDayNumber,
  context = 'exercise'
}: CommentSectionProps) {
  const { token } = useSelector((state: RootState) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'exercise' | 'private'>('all');
  
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (token) {
      loadComments();
    }
  }, [filter, exerciseId, marathonId, marathonDayNumber, token]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        filter,
        ...(exerciseId && { exerciseId }),
        ...(marathonId && { marathonId }),
        ...(marathonDayNumber && { marathonDayNumber: marathonDayNumber.toString() })
      });

      const response = await fetch(`${API_URL}/api/comments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newCommentContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newCommentContent,
          isPrivate,
          exerciseId,
          marathonId,
          marathonDayNumber
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewCommentContent('');
        setIsPrivate(false);
        alert(data.message || 'Комментарий отправлен!');
        loadComments();
      } else {
        alert(data.error || 'Ошибка отправки комментария');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Ошибка отправки комментария');
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyContent,
          parentCommentId,
          isPrivate: false,
          exerciseId,
          marathonId,
          marathonDayNumber
        })
      });

      const data = await response.json();
      if (data.success) {
        setReplyContent('');
        setReplyingTo(null);
        alert(data.message || 'Ответ отправлен!');
        loadComments();
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Ошибка отправки ответа');
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await fetch(`${API_URL}/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      loadComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (user: Comment['userId']) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return 'Пользователь';
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: 'var(--color-text-primary, #1F2937)'
      }}>
        Комментарии
      </h3>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--color-border, #E5E7EB)',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: `3px solid ${filter === 'all' ? 'var(--color-primary, #3B82F6)' : 'transparent'}`,
            color: filter === 'all' ? 'var(--color-primary, #3B82F6)' : 'var(--color-text-secondary, #6B7280)',
            fontWeight: filter === 'all' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '15px',
            marginBottom: '-2px'
          }}
        >
          Все комментарии
        </button>
        <button
          onClick={() => setFilter('exercise')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: `3px solid ${filter === 'exercise' ? 'var(--color-primary, #3B82F6)' : 'transparent'}`,
            color: filter === 'exercise' ? 'var(--color-primary, #3B82F6)' : 'var(--color-text-secondary, #6B7280)',
            fontWeight: filter === 'exercise' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '15px',
            marginBottom: '-2px'
          }}
        >
          По упражнению
        </button>
        <button
          onClick={() => setFilter('private')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: `3px solid ${filter === 'private' ? 'var(--color-primary, #3B82F6)' : 'transparent'}`,
            color: filter === 'private' ? 'var(--color-primary, #3B82F6)' : 'var(--color-text-secondary, #6B7280)',
            fontWeight: filter === 'private' ? '600' : '400',
            cursor: 'pointer',
            fontSize: '15px',
            marginBottom: '-2px'
          }}
        >
          🔒 Личные с тренером
        </button>
      </div>

      {/* New Comment Form */}
      <div style={{
        background: 'var(--color-surface, #FFFFFF)',
        border: '1px solid var(--color-border, #E5E7EB)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder={isPrivate ? "Написать тренеру (личное сообщение)..." : "Напишите комментарий..."}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--color-border, #D1D5DB)',
            borderRadius: '8px',
            fontSize: '15px',
            marginBottom: '12px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--color-text-secondary, #6B7280)'
          }}>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: 'var(--color-primary, #3B82F6)'
              }}
            />
            Личное сообщение тренеру
          </label>
          <button
            onClick={submitComment}
            disabled={!newCommentContent.trim() || submitting}
            style={{
              padding: '12px 24px',
              background: newCommentContent.trim() && !submitting
                ? 'var(--color-primary, #3B82F6)'
                : 'var(--color-neutral-300, #D1D5DB)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: newCommentContent.trim() && !submitting ? 'pointer' : 'not-allowed',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
        {isPrivate && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'var(--color-warning-light, #FEF3C7)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--color-warning-dark, #92400E)'
          }}>
            💡 Личные сообщения видны только вам и тренеру
          </div>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text-secondary, #6B7280)'
        }}>
          Загрузка комментариев...
        </div>
      ) : comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--color-text-secondary, #6B7280)',
          background: 'var(--color-surface, #F9FAFB)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            {filter === 'private' 
              ? 'У вас пока нет личных сообщений с тренером'
              : 'Пока нет комментариев. Будьте первым!'}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                background: 'var(--color-surface, #FFFFFF)',
                border: '1px solid var(--color-border, #E5E7EB)',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              {/* Comment Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--color-text-primary, #1F2937)',
                    marginBottom: '4px'
                  }}>
                    {getUserName(comment.userId)}
                    {comment.isPrivate && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        background: 'var(--color-warning-light, #FEF3C7)',
                        color: 'var(--color-warning-dark, #92400E)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        🔒 ЛИЧНОЕ
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--color-text-tertiary, #9CA3AF)'
                  }}>
                    {formatDate(comment.createdAt)}
                    {comment.isEdited && ' (отредактировано)'}
                  </div>
                </div>
                <button
                  onClick={() => likeComment(comment._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'var(--color-neutral-100, #F3F4F6)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ❤️ {comment.likes}
                </button>
              </div>

              {/* Comment Content */}
              <div style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'var(--color-text-primary, #1F2937)',
                marginBottom: '12px',
                whiteSpace: 'pre-wrap'
              }}>
                {comment.content}
              </div>

              {/* Reply Button */}
              {!comment.isPrivate && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: 'var(--color-primary, #3B82F6)',
                    border: '1px solid var(--color-primary, #3B82F6)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {replyingTo === comment._id ? 'Отмена' : 'Ответить'}
                </button>
              )}

              {/* Reply Form */}
              {replyingTo === comment._id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'var(--color-neutral-50, #F9FAFB)',
                  borderRadius: '8px'
                }}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Напишите ответ..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--color-border, #D1D5DB)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '10px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    onClick={() => submitReply(comment._id)}
                    disabled={!replyContent.trim()}
                    style={{
                      padding: '8px 16px',
                      background: replyContent.trim()
                        ? 'var(--color-primary, #3B82F6)'
                        : 'var(--color-neutral-300, #D1D5DB)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: replyContent.trim() ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Отправить
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div style={{
                  marginTop: '16px',
                  paddingLeft: '20px',
                  borderLeft: '3px solid var(--color-primary-light, #DBEAFE)'
                }}>
                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'var(--color-neutral-50, #F9FAFB)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <span style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            color: 'var(--color-text-primary, #1F2937)'
                          }}>
                            {getUserName(reply.userId)}
                          </span>
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '12px',
                            color: 'var(--color-text-tertiary, #9CA3AF)'
                          }}>
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <button
                          onClick={() => likeComment(reply._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ❤️ {reply.likes}
                        </button>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: 'var(--color-text-secondary, #4B5563)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {reply.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

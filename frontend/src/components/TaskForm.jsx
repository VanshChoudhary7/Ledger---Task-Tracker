import { useEffect, useState } from 'react';

const EMPTY = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

function validate(values) {
  const errors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (values.description && values.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters.';
  }

  if (values.dueDate) {
    const d = new Date(values.dueDate);
    if (Number.isNaN(d.getTime())) {
      errors.dueDate = 'Enter a valid date.';
    }
  }

  return errors;
}

export default function TaskForm({ initialTask, onSubmit, onCancel, submitLabel }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setValues({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || 'todo',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setValues(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [initialTask]);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ title: true, description: true, dueDate: true });

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={handleChange('title')}
          onBlur={handleBlur('title')}
          placeholder="e.g. Draft the quarterly report"
          maxLength={120}
          aria-invalid={Boolean(touched.title && errors.title)}
        />
        {touched.title && errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={handleChange('description')}
          onBlur={handleBlur('description')}
          placeholder="Optional details, links, or notes"
          maxLength={1000}
          aria-invalid={Boolean(touched.description && errors.description)}
        />
        {touched.description && errors.description && (
          <p className="field-error">{errors.description}</p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={values.status} onChange={handleChange('status')}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={values.priority} onChange={handleChange('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange('dueDate')}
            onBlur={handleBlur('dueDate')}
            aria-invalid={Boolean(touched.dueDate && errors.dueDate)}
          />
          {touched.dueDate && errors.dueDate && (
            <p className="field-error">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel || 'Add task'}
        </button>
      </div>
    </form>
  );
}

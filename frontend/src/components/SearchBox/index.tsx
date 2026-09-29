import { useState, useRef, useEffect } from 'react';

interface Option {
  id: number;
  label: string;
}

interface SearchBoxProps {
  label: string;
  options: Option[];
  value: number;
  onChange: (id: number) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchBox({ label, options, value, onChange, placeholder = 'Buscar...', required }: SearchBoxProps) {
  const selected = options.find(o => o.id === value);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  // Sincroniza query quando value muda externamente (ex: reset de form)
  useEffect(() => {
    setQuery(options.find(o => o.id === value)?.label ?? '');
  }, [value, options]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Se saiu sem selecionar, volta pro texto do valor atual
        setQuery(options.find(o => o.id === value)?.label ?? '');
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value, options]);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label className="form-label">{label}{required && ' *'}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="form-control"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          style={{ paddingRight: 28 }}
        />
        <i
          className="bi bi-search"
          style={{
            position: 'absolute', right: 10, top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 12, color: 'var(--text-faint)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {open && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', marginTop: 4,
          maxHeight: 200, overflowY: 'auto', zIndex: 999,
          listStyle: 'none', padding: '4px 0', boxShadow: 'var(--shadow)',
        }}>
          {filtered.length === 0 ? (
            <li style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-faint)' }}>
              Nenhum resultado
            </li>
          ) : filtered.map(o => (
            <li
              key={o.id}
              onMouseDown={() => { onChange(o.id); setQuery(o.label); setOpen(false); }}
              style={{
                padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                background: value === o.id ? 'var(--primary-light)' : 'transparent',
                color: value === o.id ? 'var(--primary-hover)' : 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (value !== o.id) (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = value === o.id ? 'var(--primary-light)' : 'transparent'; }}
            >
              {value === o.id && <i className="bi bi-check2" style={{ fontSize: 12, flexShrink: 0 }} />}
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Search, CheckSquare, Square } from 'lucide-react';
import { useSwipeDownDismiss } from '../../lib/systemNavigation';

/**
 * Universal Mobile-First Bottom Sheet Dropdown Selector
 * Designed specifically for touch devices (iOS & Android) to replace clunky desktop selects and horizontal pills.
 */
export default function MobileDropdown({
  label,
  title,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  isMulti = false,
  searchable = undefined,
  disabled = false,
  icon: Icon,
  style = {},
  triggerStyle = {},
  className = '',
  variant = 'default', // 'default' | 'compact' | 'pill'
  fullWidth = true,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Normalize options into { value, label, badge, description, icon }
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: opt, label: String(opt) };
      }
      return {
        value: opt.value !== undefined ? opt.value : opt.id,
        label: opt.label || opt.name || opt.title || String(opt.value),
        badge: opt.badge,
        description: opt.description,
        icon: opt.icon
      };
    });
  }, [options]);

  // Determine if search input should be shown (default true if > 5 options)
  const showSearch = searchable !== undefined ? searchable : normalizedOptions.length > 5;

  const handleOpen = () => {
    if (disabled) return;
    setSearchTerm('');
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setSearchTerm('');
    }, 280);
  };

  // Support Android gesture/hardware back button to close sheet
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      e.detail?.markHandled?.();
      handleClose();
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen]);

  const { dragOffset, touchHandlers } = useSwipeDownDismiss(handleClose);

  // Focus search input when sheet opens
  useEffect(() => {
    if (isOpen && showSearch) {
      const t = setTimeout(() => {
        searchInputRef.current?.focus?.();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, showSearch]);

  // Filter options by search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const q = searchTerm.toLowerCase();
    return normalizedOptions.filter(opt => {
      return (
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
      );
    });
  }, [normalizedOptions, searchTerm]);

  // Determine active display text
  const displayLabel = useMemo(() => {
    if (isMulti) {
      const selectedArr = Array.isArray(value) ? value : [];
      if (selectedArr.length === 0) return placeholder;
      if (selectedArr.length === 1) {
        const found = normalizedOptions.find(o => o.value === selectedArr[0]);
        return found ? found.label : selectedArr[0];
      }
      return `${selectedArr.length} selected`;
    } else {
      if (value === undefined || value === null || value === '') return placeholder;
      const found = normalizedOptions.find(o => o.value === value);
      return found ? found.label : String(value);
    }
  }, [value, isMulti, normalizedOptions, placeholder]);

  const isSelected = (optVal) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(optVal);
    }
    return value === optVal;
  };

  const handleSelectOption = (optVal) => {
    if (isMulti) {
      const currentArr = Array.isArray(value) ? [...value] : [];
      const index = currentArr.indexOf(optVal);
      if (index >= 0) {
        currentArr.splice(index, 1);
      } else {
        currentArr.push(optVal);
      }
      onChange(currentArr);
    } else {
      onChange(optVal);
      handleClose();
    }
  };

  const sheetTitle = title || label || 'Select Option';

  return (
    <div
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        ...style
      }}
      className={`mobile-dropdown-container ${className}`}
    >
      {/* Optional Label */}
      {label && (
        <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      {/* Touch-Friendly Trigger Box */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          width: fullWidth ? '100%' : 'auto',
          minHeight: variant === 'compact' ? '36px' : '44px',
          padding: variant === 'compact' ? '6px 10px' : '9px 12px',
          borderRadius: variant === 'pill' ? '9999px' : '10px',
          border: isOpen ? '1.5px solid var(--brand-700)' : '1px solid var(--border)',
          background: disabled ? 'var(--surface-alt)' : 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(10, 31, 61, 0.08)' : 'none',
          opacity: disabled ? 0.6 : 1,
          ...triggerStyle
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          {Icon && (
            <Icon size={16} color="var(--brand-700)" style={{ flexShrink: 0 }} />
          )}
          <span
            style={{
              fontSize: variant === 'compact' ? '12px' : '13px',
              fontWeight: 600,
              color: (value === '' || value === null || value === undefined || (isMulti && (!value || value.length === 0)))
                ? 'var(--text-muted)'
                : 'var(--brand-900)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {displayLabel}
          </span>
        </div>

        <ChevronDown
          size={16}
          color="var(--text-muted)"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {/* Mobile Bottom Sheet Modal via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: isClosing ? 'backdropFadeOut 0.28s ease forwards' : 'backdropFadeIn 0.25s ease forwards'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
            style={{
              background: 'var(--surface)',
              borderRadius: '20px 20px 0 0',
              borderTop: '1px solid var(--border)',
              maxHeight: '82vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
              transform: dragOffset > 0 ? `translate3d(0, ${dragOffset}px, 0)` : undefined,
              transition: dragOffset > 0 ? 'none' : undefined,
              paddingBottom: 'calc(16px + max(var(--safe-area-bottom, 0px), env(safe-area-inset-bottom, 0px)))'
            }}
          >
            {/* Sheet Drag Handle for Mobile Swipe-Down */}
            <div
              {...touchHandlers}
              style={{
                width: '100%',
                padding: '10px 0 4px',
                display: 'flex',
                justifyContent: 'center',
                cursor: 'grab',
                touchAction: 'none'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '4px',
                  borderRadius: '9999px',
                  background: 'var(--border)'
                }}
              />
            </div>

            {/* Header: Title, Count & Close */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px 12px',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  {sheetTitle}
                </h4>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  {normalizedOptions.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Filter (if > 5 options or explicit) */}
            {showSearch && (
              <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface-alt)' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={15}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search in ${sheetTitle}...`}
                    style={{
                      width: '100%',
                      padding: '8px 32px 8px 34px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                      background: 'var(--surface)',
                      outline: 'none'
                    }}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '2px'
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Options List with Generous 48px Touch Rows */}
            <div
              style={{
                flex: 1,
                minHeight: '120px',
                maxHeight: '52vh',
                overflowY: 'auto',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {filteredOptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>No matching options found</p>
                  <span style={{ fontSize: '11.5px' }}>Try searching for a different keyword</span>
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const active = isSelected(opt.value);
                  const OptIcon = opt.icon;

                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      style={{
                        width: '100%',
                        minHeight: '48px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: active ? '1.5px solid var(--brand-700)' : '1px solid transparent',
                        background: active ? 'var(--brand-50)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        {isMulti ? (
                          active ? (
                            <CheckSquare size={18} color="var(--brand-800)" style={{ flexShrink: 0 }} />
                          ) : (
                            <Square size={18} color="var(--border)" style={{ flexShrink: 0 }} />
                          )
                        ) : OptIcon ? (
                          <OptIcon size={16} color={active ? 'var(--brand-800)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                        ) : null}

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '13.5px',
                                fontWeight: active ? 800 : 600,
                                color: active ? 'var(--brand-900)' : 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {opt.label}
                            </span>
                            {opt.badge && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  background: active ? 'var(--brand-700)' : 'var(--surface-alt)',
                                  color: active ? '#ffffff' : 'var(--text-secondary)',
                                  fontWeight: 700
                                }}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          {opt.description && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isMulti && active && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--brand-800)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Check size={14} strokeWidth={2.8} />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Action Bar for Multi-select */}
            {isMulti && (
              <div
                style={{
                  padding: '12px 18px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const allVals = normalizedOptions.map(o => o.value);
                    const isAll = Array.isArray(value) && value.length === allVals.length;
                    onChange(isAll ? [] : allVals);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: 'var(--brand-900)',
                    cursor: 'pointer'
                  }}
                >
                  {Array.isArray(value) && value.length === normalizedOptions.length ? 'Clear All' : 'Select All'}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--brand-800)',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(10, 31, 61, 0.2)'
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

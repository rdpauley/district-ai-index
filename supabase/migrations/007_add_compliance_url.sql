-- ============================================================
-- Migration 007: Add URL to Compliance Signals
-- ============================================================

-- Add URL field so districts can click through to actual documentation
alter table compliance_signals
  add column url text;

comment on column compliance_signals.url is 'Direct URL to the vendor privacy/compliance documentation page for this specific signal. NULL if no public URL available.';

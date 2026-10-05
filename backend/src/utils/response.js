/**
 * Shared response helpers — keep API shape consistent everywhere.
 */

export const ok = (res, data, meta = {}) =>
  res.status(200).json({ success: true, data, ...meta });

export const created = (res, data) =>
  res.status(201).json({ success: true, data });

export const notFound = (res, message = 'Resource not found') =>
  res.status(404).json({ success: false, error: message });

export const badRequest = (res, message = 'Bad request') =>
  res.status(400).json({ success: false, error: message });

export const serverError = (res, err) => {
  console.error('[SafeSteel API Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
};

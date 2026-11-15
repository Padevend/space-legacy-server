export function ok(c, data, extraMeta) {
    const requestId = c.get('requestId') || 'unknown';
    const meta = { requestId, ...(extraMeta ?? {}) };
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true, data, meta }, 200);
}
export function created(c, data, location) {
    const requestId = c.get('requestId') || 'unknown';
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    if (location) {
        c.header('Location', location);
    }
    return c.json({ success: true, data, meta: { requestId } }, 201);
}
export function paginated(c, data, pagination) {
    const requestId = c.get('requestId') || 'unknown';
    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
    const meta = {
        requestId,
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        totalPages,
    };
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true, data, meta }, 200);
}
export function noContent(c) {
    const requestId = c.get('requestId') || 'unknown';
    c.header('X-Request-Id', requestId);
    return c.body(null, 204);
}

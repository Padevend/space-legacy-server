import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { healthController } from './health.controller.js';
import { healthLiveResponseSchema, healthReadyResponseSchema } from './health.schemas.js';
import { z } from 'zod';
export const liveRoute = createRoute({
    method: 'get',
    path: '/live',
    summary: 'Process Liveness Probe',
    description: 'Checks whether the API server process is running and able to handle incoming requests.',
    tags: ['Health'],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: healthLiveResponseSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Process is live and operational.',
        },
    },
});
export const readyRoute = createRoute({
    method: 'get',
    path: '/ready',
    summary: 'System Readiness Probe',
    description: 'Checks whether external dependencies (PostgreSQL database) are reachable and healthy.',
    tags: ['Health'],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: healthReadyResponseSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'System is ready to serve traffic.',
        },
        503: {
            description: 'Database or external dependency unreachable.',
        },
    },
});
export const healthRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
healthRouter.openapi(liveRoute, healthController.live);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
healthRouter.openapi(readyRoute, healthController.ready);

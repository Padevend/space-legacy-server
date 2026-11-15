import { usersService } from './users.service.js';
import { usersSerializer } from './users.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { listUsersQuerySchema } from './users.schemas.js';
export class UsersController {
    service;
    serializer;
    constructor(service = usersService, serializer = usersSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listUsersQuerySchema.parse(rawQuery);
        const result = await this.service.listUsers(query);
        const serialized = this.serializer.serializeUserList(result.items);
        return paginated(c, serialized, {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
        });
    };
    get = async (c) => {
        const id = c.req.param('id');
        const user = await this.service.getUserById(id);
        const serialized = this.serializer.serializeUser(user);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const user = await this.service.createUser(body, { actorId, requestId });
        const serialized = this.serializer.serializeUser(user);
        return created(c, serialized, `/api/v1/admin/users/${user.userId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.updateUser(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeUser(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.deleteUser(id, { actorId, requestId });
        return ok(c, { message: 'User deleted successfully.' });
    };
}
export const usersController = new UsersController();

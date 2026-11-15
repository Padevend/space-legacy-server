import type { Context } from 'hono';
import { usersService, type UsersService } from './users.service.js';
import { usersSerializer, type UsersSerializer } from './users.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { listUsersQuerySchema, type CreateUserRequestDto, type UpdateUserRequestDto } from './users.schemas.js';

export class UsersController {
  constructor(
    private readonly service: UsersService = usersService,
    private readonly serializer: UsersSerializer = usersSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
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

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const user = await this.service.getUserById(id);
    const serialized = this.serializer.serializeUser(user);
    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateUserRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const user = await this.service.createUser(body, { actorId, requestId });
    const serialized = this.serializer.serializeUser(user);

    return created(c, serialized, `/api/v1/admin/users/${user.userId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateUserRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.updateUser(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeUser(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.deleteUser(id, { actorId, requestId });
    return ok(c, { message: 'User deleted successfully.' });
  };
}

export const usersController = new UsersController();

import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { userService, type UserService } from '../services/user_service.js';
import { userSerializer, type UserSerializer } from '../serializers/user_serializer.js';
import { listUsersQuerySchema, type CreateUserRequestDto, type UpdateUserRequestDto } from '../validators/user.js';

export class UsersController {
  constructor(
    private readonly service: UserService = userService,
    private readonly serializer: UserSerializer = userSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listUsersQuerySchema.parse(rawQuery);

    const result = await this.service.listUsers(query);
    const serialized = this.serializer.serializeUserList(result.items);

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, serialized, {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        })
      : c.json(
          {
            success: true,
            data: serialized,
            meta: { page: result.page, pageSize: result.pageSize, total: result.total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const user = await this.service.getUserById(id);
    const serialized = this.serializer.serializeUser(user);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateUserRequestDto;

    const user = await this.service.createUser(body);
    const serialized = this.serializer.serializeUser(user);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/admin/users/${user.userId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateUserRequestDto;

    const updated = await this.service.updateUser(id, body);
    const serialized = this.serializer.serializeUser(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.deleteUser(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'User deleted successfully.' })
      : c.json({ success: true, data: { message: 'User deleted successfully.' } }, 200);
  };

  delete = this.destroy;
}

export const usersController = new UsersController();

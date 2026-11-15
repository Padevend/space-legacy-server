export class UsersSerializer {
    serializeUser(user) {
        return {
            userId: user.userId,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
    serializeUserList(users) {
        return users.map((user) => this.serializeUser(user));
    }
}
export const usersSerializer = new UsersSerializer();

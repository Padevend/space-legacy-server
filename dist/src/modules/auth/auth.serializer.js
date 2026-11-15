export class AuthSerializer {
    serializeUserProfile(user) {
        return {
            userId: user.userId,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
    serializeLoginResponse(user, accessToken, expiresIn) {
        return {
            user: this.serializeUserProfile(user),
            accessToken,
            tokenType: 'Bearer',
            expiresIn,
        };
    }
    serializeRefreshResponse(accessToken, expiresIn) {
        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn,
        };
    }
}
export const authSerializer = new AuthSerializer();

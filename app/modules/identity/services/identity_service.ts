import { identityRepository, IdentityRepository } from '../repositories/identity_repository.js';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from '../validators/identity.js';
import type { SessionResolver, SessionContext } from '#contracts/auth_contract';
import {
  generateSessionToken,
  hashSessionToken,
  getAnonymousSessionExpiry,
  getAccountSessionExpiry,
} from '#shared/security/token';
import { hashPassword, verifyPassword } from '#shared/security/password';
import { UnauthorizedError, ConflictError, NotFoundError, ValidationError } from '#shared/errors';
import { eventBus } from '#shared/events/index';

export class IdentityService implements SessionResolver {
  private repo: IdentityRepository;

  constructor(repo?: IdentityRepository) {
    this.repo = repo ?? identityRepository;
  }

  /**
   * Session resolution contract for auth_middleware (SessionResolver).
   */
  async resolveSession(rawToken: string): Promise<SessionContext | null> {
    if (!rawToken || typeof rawToken !== 'string') return null;

    const tokenHash = hashSessionToken(rawToken);
    const session = await this.repo.findSessionByTokenHash(tokenHash);

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const isAnonymous = session.visitor.account === null;
    const newExpiry = isAnonymous ? getAnonymousSessionExpiry() : getAccountSessionExpiry();

    // Sliding window touch
    await this.repo.touchSession(session.id, newExpiry).catch(() => {});

    return {
      sessionId: session.id,
      visitorId: session.visitorId,
      isAnonymous,
      account: session.visitor.account
        ? {
            id: session.visitor.account.id,
            email: session.visitor.account.email,
            displayName: session.visitor.account.displayName,
            role: session.visitor.account.role,
          }
        : null,
      rawToken,
    };
  }

  /**
   * POST /session/anonymous
   * Idempotent: returns existing identity if token valid, else creates new.
   */
  async getOrCreateAnonymousSession(currentRawToken?: string): Promise<{
    token: string;
    isAnonymous: boolean;
    visitorId: string;
  }> {
    if (currentRawToken) {
      const resolved = await this.resolveSession(currentRawToken);
      if (resolved) {
        return {
          token: currentRawToken,
          isAnonymous: resolved.isAnonymous,
          visitorId: resolved.visitorId,
        };
      }
    }

    const visitor = await this.repo.createVisitor();
    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = getAnonymousSessionExpiry();

    await this.repo.createSession({
      visitorId: visitor.id,
      tokenHash,
      expiresAt,
    });

    return {
      token,
      isAnonymous: true,
      visitorId: visitor.id,
    };
  }

  /**
   * POST /auth/register
   * Creates an account and ties it to current visitorId.
   */
  async register(
    visitorId: string,
    input: RegisterInput
  ): Promise<{
    token: string;
    isAnonymous: boolean;
    visitorId: string;
    account: {
      id: string;
      email: string;
      displayName: string;
      role: string;
    };
  }> {
    const existingVisitor =
      visitorId && visitorId.trim().length > 0 ? await this.repo.findVisitorById(visitorId) : null;

    if (existingVisitor?.account) {
      throw new ConflictError('Visitor already has an associated account.');
    }

    if (!existingVisitor) {
      const newVisitor = await this.repo.createVisitor();
      visitorId = newVisitor.id;
    }

    const existingEmail = await this.repo.findAccountByEmail(input.email);
    if (existingEmail) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(input.password);

    const account = await this.repo.createAccount({
      visitorId,
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    });

    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = getAccountSessionExpiry();

    await this.repo.createSession({
      visitorId,
      tokenHash,
      expiresAt,
    });

    return {
      token,
      isAnonymous: false,
      visitorId,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        role: account.role,
      },
    };
  }

  /**
   * POST /auth/login
   * Authenticates user. If currentVisitorId differs, merges anonymous data into account.
   */
  async login(
    input: LoginInput,
    currentVisitorId?: string
  ): Promise<{
    token: string;
    isAnonymous: boolean;
    visitorId: string;
    account: {
      id: string;
      email: string;
      displayName: string;
      role: string;
    };
  }> {
    const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$u83JgC2j0gD9Rk/z+1kS2Q';

    const account = await this.repo.findAccountByEmail(input.email);

    if (!account) {
      await verifyPassword(DUMMY_HASH, input.password);
      throw new UnauthorizedError('Invalid email or password.');
    }

    const passwordMatches = await verifyPassword(account.passwordHash, input.password);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Merge anonymous progress into account if applicable
    if (currentVisitorId && currentVisitorId !== account.visitorId) {
      await this.repo.mergeAndCleanAnonymousVisitor(currentVisitorId, account.visitorId, async (tx) => {
        // 1. Emit domain event so games module transfers attempts & merges badges
        await eventBus.emit('VisitorMerged', { fromId: currentVisitorId, toId: account.visitorId }, tx);
      });
    }

    // Generate account session (30 days sliding)
    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = getAccountSessionExpiry();

    await this.repo.createSession({
      visitorId: account.visitorId,
      tokenHash,
      expiresAt,
    });

    return {
      token,
      isAnonymous: false,
      visitorId: account.visitorId,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        role: account.role,
      },
    };
  }

  /**
   * POST /auth/logout
   */
  async logout(rawToken: string): Promise<void> {
    if (!rawToken) return;
    const tokenHash = hashSessionToken(rawToken);
    const session = await this.repo.findSessionByTokenHash(tokenHash);
    if (session) {
      await this.repo.deleteSession(session.id);
    }
  }

  /**
   * GET /me
   */
  async getMe(visitorId: string): Promise<{
    isAnonymous: boolean;
    visitorId: string;
    account: {
      id: string;
      email: string;
      displayName: string;
      role: string;
    } | null;
  }> {
    const visitor = await this.repo.findVisitorById(visitorId);
    if (!visitor) {
      throw new NotFoundError('Visitor not found.');
    }

    if (visitor.account) {
      return {
        isAnonymous: false,
        visitorId: visitor.id,
        account: {
          id: visitor.account.id,
          email: visitor.account.email,
          displayName: visitor.account.displayName,
          role: visitor.account.role,
        },
      };
    }

    return {
      isAnonymous: true,
      visitorId: visitor.id,
      account: null,
    };
  }

  /**
   * PATCH /me
   */
  async updateProfile(
    visitorId: string,
    input: UpdateProfileInput
  ): Promise<{
    id: string;
    email: string;
    displayName: string;
    role: string;
  }> {
    const account = await this.repo.findAccountByVisitorId(visitorId);
    if (!account) {
      throw new UnauthorizedError('Account required.');
    }

    if (input.email && input.email !== account.email) {
      const existing = await this.repo.findAccountByEmail(input.email);
      if (existing) {
        throw new ConflictError('An account with this email address already exists.');
      }
    }

    const updateData: { displayName?: string; email?: string } = {};
    if (input.displayName !== undefined) updateData.displayName = input.displayName;
    if (input.email !== undefined) updateData.email = input.email;

    const updated = await this.repo.updateAccount(account.id, updateData);

    return {
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      role: updated.role,
    };
  }

  /**
   * PATCH /me/password
   */
  async updatePassword(visitorId: string, input: UpdatePasswordInput): Promise<{ success: true }> {
    const account = await this.repo.findAccountByVisitorId(visitorId);
    if (!account) {
      throw new UnauthorizedError('Account required.');
    }

    const matches = await verifyPassword(account.passwordHash, input.currentPassword);
    if (!matches) {
      throw new UnauthorizedError('Current password is incorrect.');
    }

    const newHash = await hashPassword(input.newPassword);
    await this.repo.updateAccount(account.id, { passwordHash: newHash });

    return { success: true };
  }

  /**
   * DELETE /me
   * Real hard cascade deletion (N8).
   */
  async deleteAccount(visitorId: string, input: DeleteAccountInput): Promise<{ deleted: true }> {
    const account = await this.repo.findAccountByVisitorId(visitorId);
    if (!account) {
      throw new UnauthorizedError('Account required.');
    }

    if (input.confirmation !== 'DELETE') {
      throw new ValidationError('Confirmation must be DELETE.');
    }

    const matches = await verifyPassword(account.passwordHash, input.password);
    if (!matches) {
      throw new UnauthorizedError('Password is incorrect.');
    }

    // Hard physical cascade deletion: deleting Visitor deletes Account, Sessions, QuizAttempts, Answers, Badges
    await this.repo.deleteVisitorCascade(visitorId);

    return { deleted: true };
  }
}

export const identityService = new IdentityService();

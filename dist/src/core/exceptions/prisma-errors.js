import { AppException } from './AppException.js';
export function mapPrismaError(error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const prismaErr = error;
        const code = prismaErr.code;
        switch (code) {
            case 'P2002': {
                const target = Array.isArray(prismaErr.meta?.['target'])
                    ? prismaErr.meta['target'].join(', ')
                    : 'field';
                return AppException.conflict(`A record with this ${target} already exists.`);
            }
            case 'P2025': {
                return AppException.notFound('Resource', 'The requested record does not exist or has been deleted.');
            }
            case 'P2003': {
                return AppException.conflict('The operation violates a relational foreign key constraint.');
            }
            case 'P2034': {
                return AppException.conflict('Transaction failed due to concurrent modification conflict. Please retry.');
            }
            case 'P1000':
            case 'P1001':
            case 'P1002':
            case 'P1008':
            case 'P1017': {
                return AppException.serviceUnavailable('Database server is temporarily unreachable.');
            }
            default:
                break;
        }
    }
    return AppException.internal('An unexpected database error occurred.', error);
}

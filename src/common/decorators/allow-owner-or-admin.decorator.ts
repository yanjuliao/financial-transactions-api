import { SetMetadata } from '@nestjs/common';

export const ALLOW_OWNER_OR_ADMIN_KEY = 'allowOwnerOrAdmin';
export const AllowOwnerOrAdmin = () => SetMetadata(ALLOW_OWNER_OR_ADMIN_KEY, true);

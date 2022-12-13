import type { Application, CreateApplication } from '@logto/schemas';
import { Applications } from '@logto/schemas';
import type { OmitAutoSetFields } from '@logto/shared';
import { convertToIdentifiers, conditionalSql, manyRows } from '@logto/shared';
import { sql } from 'slonik';

import { buildFindEntityById } from '#src/database/find-entity-by-id.js';
import { buildInsertInto } from '#src/database/insert-into.js';
import { getTotalRowCount } from '#src/database/row-count.js';
import { buildUpdateWhere } from '#src/database/update-where.js';
import envSet from '#src/env-set/index.js';
import { DeletionError } from '#src/errors/SlonikError/index.js';

const { table, fields } = convertToIdentifiers(Applications);

export const findTotalNumberOfApplications = async () => getTotalRowCount(table);

export const findAllApplications = async (limit: number, offset: number) =>
  manyRows(
    envSet.pool.query<Application>(sql`
      select ${sql.join(Object.values(fields), sql`, `)}
      from ${table}
      order by ${fields.createdAt} desc
      ${conditionalSql(limit, (limit) => sql`limit ${limit}`)}
      ${conditionalSql(offset, (offset) => sql`offset ${offset}`)}
    `)
  );

export const findApplicationById = buildFindEntityById<CreateApplication, Application>(
  Applications
);

export const insertApplication = buildInsertInto<CreateApplication, Application>(Applications, {
  returning: true,
});

const updateApplication = buildUpdateWhere<CreateApplication, Application>(Applications, true);

export const updateApplicationById = async (
  id: string,
  set: Partial<OmitAutoSetFields<CreateApplication>>
) => updateApplication({ set, where: { id }, jsonbMode: 'merge' });

export const deleteApplicationById = async (id: string) => {
  const { rowCount } = await envSet.pool.query(sql`
    delete from ${table}
    where ${fields.id}=${id}
  `);

  if (rowCount < 1) {
    throw new DeletionError(Applications.table, id);
  }
};

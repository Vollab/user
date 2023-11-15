import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createView(
		'full_candidate',
		{},
		`
    SELECT
      *
    FROM
      vacancy.user u
    JOIN
      vacancy.candidate o USING(id)
    `
	)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropView('full_candidate')
}

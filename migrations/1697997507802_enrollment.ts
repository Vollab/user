import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addType('enrollment_status', ['PENDING', 'REFUSED', 'APPROVED', 'ACCEPTED', 'WAIVER'])
	pgm.createTable(
		{ schema: 'vacancy', name: 'enrollment' },
		{
			vacancy_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'vacancy',
				onDelete: 'CASCADE'
			},
			candidate_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'candidate',
				onDelete: 'CASCADE'
			},
			status: {
				type: 'enrollment_status',
				notNull: true,
				default: 'PENDING'
			},
			created_at: {
				type: 'timestamp with time zone',
				notNull: true,
				default: pgm.func("(now() at time zone 'utc')")
			},
			updated_at: {
				type: 'timestamp with time zone',
				notNull: true,
				default: pgm.func("(now() at time zone 'utc')")
			}
		}
	)

	pgm.createTrigger('enrollment', 'updated_at', {
		when: 'BEFORE',
		operation: 'UPDATE',
		function: 'update_updated_at',
		level: 'ROW'
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTrigger('enrollment', 'updated_at', { ifExists: true })
	pgm.dropTable('enrollment')
	pgm.dropType('enrollment_status')
}

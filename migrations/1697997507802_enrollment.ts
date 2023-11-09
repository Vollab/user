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
				references: 'vacancy'
			},
			candidate_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'candidate'
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('enrollment')
	pgm.dropType('enrollment_status')
}

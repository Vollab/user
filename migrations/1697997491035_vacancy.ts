import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addType('work_mode', ['REMOTE', 'IN_PERSON', 'HYBRID'])
	pgm.createTable(
		{ schema: 'vacancy', name: 'vacancy' },
		{
			id: {
				type: 'uuid',
				default: pgm.func('gen_random_uuid()'),
				notNull: true,
				primaryKey: true
			},
			demand_id: {
				type: 'uuid',
				notNull: true,
				references: 'demand',
				onDelete: 'CASCADE'
			},
			activity_area_id: {
				type: 'uuid',
				notNull: true,
				references: 'activity_area'
			},
			name: {
				type: 'varchar(30)',
				notNull: true
			},
			description: {
				type: 'text',
				notNull: true
			},
			work_mode: {
				type: 'work_mode',
				notNull: true
			},
			open: {
				type: 'boolean',
				notNull: true
			},
			state: {
				type: 'varchar(30)'
			},
			city: {
				type: 'varchar(30)'
			},
			street: {
				type: 'varchar(30)'
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

	pgm.createTrigger('vacancy', 'updated_at', {
		when: 'BEFORE',
		operation: 'UPDATE',
		function: 'update_updated_at',
		level: 'ROW'
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTrigger('vacancy', 'updated_at', { ifExists: true })
	pgm.dropTable('vacancy')
	pgm.dropType('work_mode')
}

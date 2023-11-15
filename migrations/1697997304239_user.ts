import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable(
		{ schema: 'vacancy', name: 'user' },
		{
			id: {
				type: 'uuid',
				default: pgm.func('gen_random_uuid()'),
				notNull: true,
				primaryKey: true
			},
			name: {
				type: 'varchar(30)',
				notNull: true
			},
			email: {
				type: 'varchar(254)',
				notNull: true,
				unique: true
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

	pgm.createFunction(
		'update_updated_at',
		[],
		{ language: 'plpgsql', returns: 'TRIGGER' },
		`
    BEGIN
			NEW.updated_at = NOW() AT TIME ZONE 'utc';
			
			RETURN NEW;
		END;
    `
	)

	pgm.createTrigger('user', 'updated_at', {
		when: 'BEFORE',
		operation: 'UPDATE',
		function: 'update_updated_at',
		level: 'ROW'
	})

	pgm.createFunction(
		'update_user_updated_at',
		[],
		{ language: 'plpgsql', returns: 'TRIGGER' },
		`
    BEGIN
			UPDATE
				vacancy.user
			SET
				updated_at = NOW() AT TIME ZONE 'utc'
			WHERE
				id = OLD.id;

			RETURN NEW;
		END;
    `
	)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropFunction('update_user_updated_at', [], { ifExists: true })
	pgm.dropTrigger('user', 'updated_at', { ifExists: true })
	pgm.dropFunction('update_updated_at', [], { ifExists: true })
	pgm.dropTable('user')
}

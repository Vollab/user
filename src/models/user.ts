import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export interface User {
	id: string
	email: string
	name: string
	updated_at: Date
	created_at: Date
}

class UserModel {
	constructor(private db: typeof database) {}

	async insert(user: User) {
		const { id, name, email, created_at, updated_at } = user

		return this.db.query<User>(
			`
			INSERT INTO
				vacancy.user (id, name, email, created_at, updated_at)
			VALUES
				($1, $2, $3, $4, $5)
			RETURNING
				*
			;`,
			[id, name, email, created_at, updated_at]
		)
	}

	async update(id: User['id'], user: PartialOmit<User, 'id' | 'email' | 'created_at'>) {
		const entries = Object.entries(user).filter(e => e[1] != null)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 2}`)
		const values = entries.map(e => e[1])

		return this.db.query<User>(
			`
			UPDATE
				vacancy.user
			SET
				${keys.join(', ')}
			WHERE
				id = $1
			RETURNING
				*
			;`,
			[id, ...values]
		)
	}
}

export const user_model = new UserModel(database)

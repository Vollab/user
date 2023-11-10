import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export interface User {
	id: string
	email: string
	name: string
	updated_at: Date
	created_at: Date
}

export interface Candidate extends User {}

class CandidateModel {
	constructor(private db: typeof database) {}

	async findByEmail(email: Candidate['email']) {
		return this.db.query<Candidate>(
			`
			SELECT
				*
			FROM
				vacancy.candidate
			WHERE
				email = $1
			;`,
			[email]
		)
	}

	async insert(candidate: Omit<Candidate, 'updated_at' | 'created_at'>) {
		const { id, name, email } = candidate

		return this.db.query<Candidate>(
			`
			INSERT INTO
				vacancy.candidate (id, name, email)
			VALUES
				($1, $2, $3)
			RETURNING
				*
			;`,
			[id, name, email]
		)
	}

	async update(id: Candidate['id'], candidate: PartialOmit<Candidate, 'id' | 'email' | 'updated_at' | 'created_at'>) {
		const entries = Object.entries(candidate)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 2}`)
		const values = entries.map(e => e[1])

		return this.db.query<Candidate>(
			`
			UPDATE
				vacancy.candidate
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

export const candidate_model = new CandidateModel(database)

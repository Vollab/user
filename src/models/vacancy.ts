import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export type VacancyWorkMode = 'REMOTE' | 'IN_PERSON' | 'HYBRID'

export interface Vacancy {
	id: string
	demand_id: string
	activity_area_id: string
	name: string
	description: string
	work_mode: VacancyWorkMode
	open: boolean
	state: string
	city: string
	street: string
	created_at: Date
	updated_at: Date
}

class VacancyModel {
	constructor(private db: typeof database) {}

	async findAll() {
		return this.db.query<Vacancy>(
			`
			SELECT
				*
			FROM
				vacancy.vacancy
			;`
		)
	}

	async findById(id: Vacancy['id']) {
		return this.db.query<Vacancy>(
			`
			SELECT
				*
			FROM
				vacancy.vacancy
			WHERE
				id = $1
			;`,
			[id]
		)
	}

	async findByDemandId(demand_id: Vacancy['demand_id']) {
		return this.db.query<Vacancy>(
			`
			SELECT
				*
			FROM
				vacancy.vacancy
			WHERE
				demand_id = $1
			;`,
			[demand_id]
		)
	}

	async insert(vacancy: Omit<Vacancy, 'id' | 'open' | 'updated_at' | 'created_at'>) {
		const { demand_id, activity_area_id, name, description, state, city, street, work_mode } = vacancy

		return this.db.query<Vacancy>(
			`
			INSERT INTO
				vacancy.vacancy (demand_id, activity_area_id, name, description, state, city, street, work_mode, open)
			VALUES
				($1, $2, $3 ,$4, $5, $6, $7, $8, $9)
			RETURNING
				*
			;`,
			[demand_id, activity_area_id, name, description, state, city, street, work_mode, true]
		)
	}

	async update(id: Vacancy['id'], vacancy: PartialOmit<Vacancy, 'id' | 'updated_at' | 'created_at'>) {
		const entries = Object.entries(vacancy)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 2}`)
		const values = entries.map(e => e[1])

		return this.db.query<Vacancy>(
			`
			UPDATE
				vacancy.vacancy
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

	async delete(id: Vacancy['id']) {
		return this.db.query<Vacancy>(
			`
			DELETE FROM
				vacancy.vacancy
			WHERE
        id = $1
			RETURNING
				*
			;`,
			[id]
		)
	}
}

export const vacancy_model = new VacancyModel(database)

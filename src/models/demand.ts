import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export type DemandStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'

export interface Demand {
	id: string
	orderer_id: string
	status: DemandStatus
	created_at: Date
	updated_at: Date
}

type UpdateDemand = PartialOmit<Demand, 'id' | 'orderer_id' | 'updated_at' | 'created_at'>

class DemandModel {
	constructor(private db: typeof database) {}

	async findById(id: Demand['id']) {
		return this.db.query<Demand>(
			`
			SELECT
				*
			FROM
				vacancy.demand
			WHERE
				id = $1
			;`,
			[id]
		)
	}

	async findByIdAndOrdererId(id: Demand['id'], orderer_id: Demand['orderer_id']) {
		return this.db.query<Demand>(
			`
			SELECT
				*
			FROM
				vacancy.demand
			WHERE
				id = $1
			AND
				orderer_id = $2
			;`,
			[id, orderer_id]
		)
	}

	async insert(demand: Omit<Demand, 'updated_at' | 'created_at'>) {
		const { id, orderer_id, status } = demand

		return this.db.query<Demand>(
			`
			INSERT INTO
				vacancy.demand (id, orderer_id, status)
			VALUES
				($1, $2, $3)
			RETURNING
				*
			;`,
			[id, orderer_id, status]
		)
	}

	async update(id: Demand['id'], demand: UpdateDemand) {
		const entries = Object.entries(demand)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 3}`)
		const values = entries.map(e => e[1])

		return this.db.query<Demand>(
			`
			UPDATE
				vacancy.demand
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

	async delete(id: Demand['id']) {
		return this.db.query<Demand>(
			`
			DELETE FROM
				vacancy.demand
			WHERE
        id = $1
			RETURNING
				*
			;`,
			[id]
		)
	}
}

export const demand_model = new DemandModel(database)

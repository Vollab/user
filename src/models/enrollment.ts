import { AtLeastOne, PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export type EnrollmentStatus = 'PENDING' | 'REFUSED' | 'APPROVED' | 'ACCEPTED' | 'WAIVER'

export interface Enrollment {
	vacancy_id: string
	candidate_id: string
	status: EnrollmentStatus
	created_at: Date
	updated_at: Date
}

type InsertEnrollment = Omit<Enrollment, 'status' | 'created_at' | 'updated_at'>
type UpdateEnrollment = PartialOmit<Enrollment, 'vacancy_id' | 'candidate_id' | 'created_at' | 'updated_at'>

class EnrollmentModel {
	constructor(private db: typeof database) {}

	async findByVacancyIdAndCandidateId(vacancy_id: Enrollment['vacancy_id'], candidate_id: Enrollment['candidate_id']) {
		return this.db.query<Enrollment>(
			`
			SELECT
				*
			FROM
				vacancy.enrollment
			WHERE
				vacancy_id = $1
			AND
				candidate_id = $2
			;`,
			[vacancy_id, candidate_id]
		)
	}

	async findByCandidateId(candidate_id: Enrollment['candidate_id']) {
		return this.db.query<Enrollment>(
			`
			SELECT
				*
			FROM
				vacancy.enrollment
			WHERE
				candidate_id = $1
			;`,
			[candidate_id]
		)
	}

	async findByVacancyId(vacancy_id: Enrollment['vacancy_id']) {
		return this.db.query<Enrollment>(
			`
			SELECT
				*
			FROM
				vacancy.enrollment
			WHERE
				vacancy_id = $1
			;`,
			[vacancy_id]
		)
	}

	async insert(enrollments: AtLeastOne<InsertEnrollment>): Promise<Enrollment[]>
	async insert(...enrollments: AtLeastOne<InsertEnrollment>): Promise<Enrollment[]>
	async insert(enrollment: AtLeastOne<InsertEnrollment> | InsertEnrollment) {
		const enrollments = Array.isArray(enrollment) ? enrollment : [enrollment]
		const keys = Object.keys(enrollments[0])
		const placeholders = enrollments.map((_, ca_i) => `(${keys.map((_, k_i) => `$${1 + k_i + ca_i * keys.length}`).join(', ')})`).join(', ')
		const values = enrollments.map(ca => Object.values(ca)).flat()

		return this.db.query<Enrollment>(
			`
			INSERT INTO
				vacancy.enrollment (${keys.join(', ')})
			VALUES
				${placeholders}
			RETURNING
				*
			;`,
			values
		)
	}

	async update(vacancy_id: Enrollment['vacancy_id'], candidate_id: Enrollment['candidate_id'], candidate: UpdateEnrollment) {
		const entries = Object.entries(candidate).filter(e => e[1] != null)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 3}`)
		const values = entries.map(e => e[1])

		return this.db.query<Enrollment>(
			`
			UPDATE
				vacancy.enrollment
			SET
				${keys.join(', ')}
			WHERE
				vacancy_id = $1
			AND
				candidate_id = $2
			RETURNING
				*
			;`,
			[vacancy_id, candidate_id, ...values]
		)
	}

	async delete(vacancy_id: Enrollment['vacancy_id'], candidate_id: Enrollment['candidate_id']) {
		return this.db.query<Enrollment>(
			`
			DELETE FROM
				vacancy.enrollment
			WHERE
        vacancy_id = $1
			AND
        candidate_id = $2
			RETURNING
				*
			;`,
			[vacancy_id, candidate_id]
		)
	}
}

export const enrollment_model = new EnrollmentModel(database)

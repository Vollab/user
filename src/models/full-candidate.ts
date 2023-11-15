import { Candidate } from './candidate'
import { User } from './user'

import { database } from 'common/services'

export interface FullCandidate extends User, Candidate {}

class FullCandidateModel {
	constructor(private db: typeof database) {}

	async findByEmail(email: FullCandidate['email']) {
		return this.db.query<FullCandidate>(
			`
			SELECT
				*
			FROM
				candidate.full_candidate
			WHERE
				email = $1
			LIMIT
				1
			;`,
			[email]
		)
	}
}

export const full_candidate_model = new FullCandidateModel(database)

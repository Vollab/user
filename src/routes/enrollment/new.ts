import { param } from 'express-validator'
import express from 'express'

import { demand_model, enrollment_model, vacancy_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { ConflictError, NotFoundError } from 'common/errors'

const router = express.Router()

router.post(
	'/api/demands/:demand_id/vacancies/:vacancy_id/enroll',
	require_auth(['candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID(),
	validate_request,
	async (req, res) => {
		const candidate_id = req.current_user!.user_id
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		const [has_enrollment] = await enrollment_model.findByVacancyIdAndCandidateId(vacancy_id, candidate_id)
		if (has_enrollment) throw new ConflictError('Already enrolled!')

		const [enrollment] = await enrollment_model.insert({ candidate_id, vacancy_id })

		res.status(201).json({ enrollment })
	}
)

export { router as new_enrollment_router }

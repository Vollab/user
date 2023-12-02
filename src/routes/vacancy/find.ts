import { param } from 'express-validator'
import express from 'express'

import { demand_model, vacancy_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.get(
	'/api/demands/:demand_id/vacancies',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID(),
	validate_request,
	async (req, res) => {
		const { demand_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const vacancies = await vacancy_model.findByDemandId(demand_id)

		res.status(200).json({ vacancies })
	}
)

router.get(
	'/api/demands/:demand_id/vacancies/:vacancy_id',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID(),
	validate_request,
	async (req, res) => {
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		res.status(200).json({ vacancy })
	}
)

router.get('/api/current-user/vacancies', require_auth(['candidate']), async (req, res) => {
	const candidate_id = req.current_user!.user_id

	const vacancies = await vacancy_model.findByCandidateIdWithEnrollment(candidate_id)

	res.status(200).json({ vacancies })
})

export { router as find_vacancy_router }

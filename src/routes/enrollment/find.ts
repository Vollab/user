import { param } from 'express-validator'
import express from 'express'

import { demand_model, enrollment_model, vacancy_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.get(
	'/api/demands/:demand_id/vacancies/:vacancy_id/candidates',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().exists().notEmpty(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID().exists().notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findByIdAndOrdererId(demand_id, orderer_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		const enrollments = await enrollment_model.findByVacancyId(vacancy_id)

		res.status(200).json({ enrollments })
	}
)

router.get(
	'/api/demands/:demand_id/vacancies/:vacancy_id/candidates/:candidate_id',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().exists().notEmpty(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID().exists().notEmpty(),
	param('candidate_id', 'candidate id must be a valid UUID').isUUID().exists().notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id, vacancy_id, candidate_id } = req.params

		const [demand] = await demand_model.findByIdAndOrdererId(demand_id, orderer_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		const [enrollment] = await enrollment_model.findByVacancyIdAndCandidateId(vacancy_id, candidate_id)
		if (!enrollment) throw new NotFoundError('Enrollment not found!')

		res.status(200).json({ enrollment })
	}
)

export { router as find_enrollment_router }

import { param } from 'express-validator'
import express from 'express'

import { demand_model, enrollment_model, vacancy_model } from '../../models'

import { require_auth, transaction, validate_request } from 'common/middlewares'
import { ConflictError, NotFoundError } from 'common/errors'

const router = express.Router()

router.patch(
	'/api/demands/:demand_id/vacancies/:vacancy_id/candidates/:candidate_id/approve',
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

		const [enrollment] = await enrollment_model.update(vacancy_id, candidate_id, { status: 'APPROVED' })
		if (!enrollment) throw new NotFoundError('Enrollment not found!')

		res.status(200).json({ enrollment })
	}
)

router.patch(
	'/api/demands/:demand_id/vacancies/:vacancy_id/candidates/:candidate_id/refuse',
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

		const [enrollment] = await enrollment_model.update(vacancy_id, candidate_id, { status: 'REFUSED' })
		if (!enrollment) throw new NotFoundError('Enrollment not found!')

		res.status(200).json({ enrollment })
	}
)

router.patch(
	'/api/demands/:demand_id/vacancies/:vacancy_id/accept',
	require_auth(['candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().exists().notEmpty(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID().exists().notEmpty(),
	validate_request,
	transaction,
	async (req, res) => {
		const candidate_id = req.current_user!.user_id
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')
		if (!vacancy.open) throw new ConflictError('Vacancy is closed!')

		const [enrollment] = await enrollment_model.findByVacancyIdAndCandidateId(vacancy_id, candidate_id)
		if (!enrollment) throw new NotFoundError('Enrollment not found!')
		if (enrollment.status !== 'APPROVED') throw new ConflictError('Enrollment must be approved to accept it')

		await vacancy_model.update(vacancy_id, { open: false })

		const [updated_enrollment] = await enrollment_model.update(vacancy_id, candidate_id, { status: 'ACCEPTED' })

		res.status(200).json({ enrollment: updated_enrollment })
	}
)

router.patch(
	'/api/demands/:demand_id/vacancies/:vacancy_id/disenroll',
	require_auth(['candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const candidate_id = req.current_user!.user_id
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.findById(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		const [enrollment] = await enrollment_model.update(vacancy_id, candidate_id, { status: 'WAIVER' })
		if (!enrollment) throw new NotFoundError('Enrollment not found!')

		res.status(200).json({ enrollment })
	}
)

export { router as update_enrollment_router }

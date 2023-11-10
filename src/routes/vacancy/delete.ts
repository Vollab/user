import { param } from 'express-validator'
import express from 'express'

import { demand_model, vacancy_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.delete(
	'/api/demands/:demand_id/vacancies/:vacancy_id',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	param('vacancy_id', 'vacancy id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id, vacancy_id } = req.params

		const [demand] = await demand_model.findByIdAndOrdererId(demand_id, orderer_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.delete(vacancy_id)
		if (!vacancy) throw new NotFoundError('Vacancy not found!')

		res.status(200).json({ vacancy })
	}
)

export { router as delete_vacancy_router }

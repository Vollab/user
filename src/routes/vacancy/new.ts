import { body, param } from 'express-validator'
import express from 'express'

import { demand_model, vacancy_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.post(
	'/api/demands/:demand_id/vacancies',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	body('activity_area_id', 'activity area id must be a valid UUID').isUUID().notEmpty(),
	body('name', 'name must be between 5 and 30 characters').isLength({ min: 5, max: 30 }).notEmpty(),
	body('description', 'description must not be empty').notEmpty(),
	body('work_mode').isIn(['REMOTE', 'IN_PERSON', 'HYBRID']).notEmpty(),
	body('state').if(body('work_mode').not().equals('REMOTE')).notEmpty(),
	body('city').if(body('work_mode').not().equals('REMOTE')).notEmpty(),
	body('street').if(body('work_mode').not().equals('REMOTE')).notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id } = req.params
		const { activity_area_id, name, description, work_mode, state, city, street } = req.body

		const [demand] = await demand_model.findByIdAndOrdererId(demand_id, orderer_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [vacancy] = await vacancy_model.insert({ demand_id, activity_area_id, name, description, work_mode, state, city, street })

		res.status(201).json({ vacancy })
	}
)

export { router as new_vacancy_router }

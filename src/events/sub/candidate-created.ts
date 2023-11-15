import { JsMsg } from 'nats'

import { candidate_model, user_model } from '../../models'
import { candidate_created_consumer } from '../consumer'

import { CandidateCreatedEvent } from 'common/types/events/candidate'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateCreatedSub extends Subscriber<CandidateCreatedEvent> {
	private static _instance: CandidateCreatedSub = new CandidateCreatedSub()

	protected consumer = candidate_created_consumer

	readonly subject = Subjects.CandidateCreated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, name, email, created_at, updated_at } = this.parseMessage(msg.data)

		await user_model.insert({ id, name, email, created_at, updated_at })
		await candidate_model.insert({ id })

		msg.ack()
	}
}

const instance = CandidateCreatedSub.instance
export { instance as candidate_created_sub }
